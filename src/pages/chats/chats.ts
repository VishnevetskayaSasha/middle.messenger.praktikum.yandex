import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import template from './chats.hbs?raw';
import { chatsController } from '../../controllers';
import { CreateChatForm, Modal, AddUserForm, RemoveUserForm } from '../../components/modals';
import { store } from '../../store';
import { ChatWebSocket } from '../../services';

interface ChatView {
  id: number;
  name: string;
  avatar: string | null;
  unreadCount: number;
  lastMessage: {
    author: string;
    text: string;
    time: string;
  } | null;
  isSelected: boolean;
  onClick: (id: number) => void;
}

interface ChatsPageProps extends BlockOwnProps {
  chats: ChatView[];
  formError: string;
  chatsLoaded: boolean;
  hasChats: boolean;
  activeChatId: number | null;
  activeChatTitle: string;
  activeChatAvatar: string | null;
  onSendMessage?: (message: string) => void;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
}

export class ChatsPage extends Block<ChatsPageProps> {
  protected template = template;

  private createChatModal: Modal | null = null;
  private addUserModal: Modal | null = null;
  private chatWebSocket = new ChatWebSocket();
  private removeUserModal: Modal | null = null;

  constructor() {
    super({
      chats: [],
      formError: '',
      chatsLoaded: false,
      hasChats: false,
      activeChatId: null,
      activeChatTitle: '',
      activeChatAvatar: null,
    });

    this.setProps({
      onSendMessage: this.handleSendMessage,
      onAddUser: this.openAddUserModal,
      onRemoveUser: this.handleRemoveUser,
    });
  }

  protected componentDidMount(): void {
    if (!this.props.chatsLoaded) {
      void this.loadChats();
    }

    this.initCreateChatButton();
  }

  protected componentWillUnmount(): void {
    this.removeCreateChatButtonListeners();

    this.createChatModal?.close();
    this.createChatModal = null;


    this.addUserModal?.close();
    this.addUserModal = null;

    this.removeUserModal?.close();
    this.removeUserModal = null;
    
    this.chatWebSocket.disconnect();
  }

  private initCreateChatButton(): void {
    const createChatButton = this.refs.createChatButton as | HTMLButtonElement | undefined;
    createChatButton?.addEventListener('click', this.openCreateChatModal);
  }

  private removeCreateChatButtonListeners(): void {
    const createChatButton = this.refs.createChatButton as | HTMLButtonElement | undefined;
    createChatButton?.removeEventListener('click', this.openCreateChatModal);
  }

  private openCreateChatModal = (): void => {
    const modalRoot = this.refs.modalRoot as HTMLElement | undefined;

    if (!modalRoot || this.createChatModal) {
      return;
    }

    const form = new CreateChatForm({
      onSubmit: async (title: string) => {
        await chatsController.createChat({
          title,
        });

        this.createChatModal?.close();
        await this.loadChats();
      },
    });

    this.createChatModal = new Modal({
      title: 'Создать чат',
      content: form,
      onClose: () => {
        this.createChatModal = null;
      },
    });

    this.createChatModal.open(modalRoot);
  };

  private async loadChats(): Promise<void> {
    try {
      const chats = await chatsController.getChats();

      const chatViews: ChatView[] = chats.map(
        (chat) => ({
          id: chat.id,
          name: chat.title,
          avatar: chat.avatar,
          unreadCount: chat.unread_count,
          lastMessage:chat.last_message
            ? {
                author:
                  chat.last_message.user.login,
                text: chat.last_message.content,
                time: chat.last_message.time,
              }
            : null,
          isSelected:
          chat.id === this.props.activeChatId,

        onClick: this.selectChat,
        }),
      );

      this.setProps({
        chats: chatViews,
        chatsLoaded: true,
        hasChats: chatViews.length > 0,
        formError: '',
      });
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        console.error(
          'Ошибка загрузки чатов:',
          error.response,
        );
      }

      this.setProps({
        formError:
          'Не удалось загрузить список чатов.',
        chatsLoaded: true,
        hasChats: false,
      });
    }
  }

  private selectChat = (chatId: number): void => {
    void this.loadChatToken(chatId);

    const selectedChat = this.props.chats.find(
      (chat) => chat.id === chatId,
    );

    if (!selectedChat) {
      return;
    }

    const chats = this.props.chats.map((chat) => ({
      ...chat,
      isSelected: chat.id === chatId,
    }));

    this.setProps({
      chats,
      activeChatId: chatId,
      activeChatTitle: selectedChat.name,
      activeChatAvatar: selectedChat.avatar,
    });
  };

  private handleSendMessage = (message: string): void => {
    console.log({
      chatId: this.props.activeChatId,
      message,
    });
  };

  private async loadChatToken(chatId: number): Promise<void> {
    try {
      const user = store.getState().user;

      if (!user) {
        console.error(
          'Невозможно подключиться к чату: пользователь не найден',
        );
        return;
      }

      const { token } = await chatsController.getChatToken(chatId);
        this.chatWebSocket.disconnect();

        this.chatWebSocket.connect(
          user.id,
          chatId,
          token,
        );
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        console.error(
          'Ошибка получения токена чата:',
          error.response,
        );

        return;
      }

      console.error(
        'Не удалось получить токен чата',
        error,
      );
    }
  }

  private openAddUserModal = (): void => {
    const modalRoot = this.refs.modalRoot as HTMLElement | undefined;

    if (!modalRoot || this.addUserModal) {
      return;
    }

    const form = new AddUserForm({
      onSelectUser: async (userId: number) => {
        const chatId = this.props.activeChatId;

        if (chatId === null) {
          return;
        }

        try {
          await chatsController.addUsers({
            users: [userId],
            chatId,
          });

          this.addUserModal?.close();
          this.addUserModal = null;
        } catch (error: unknown) {
          if (error instanceof HTTPError) {
            console.error(
              'Ошибка добавления пользователя:',
              error.response,
            );

            return;
          }

          console.error(
            'Не удалось добавить пользователя',
            error,
          );
        }
      },
    });

    this.addUserModal = new Modal({
      title: 'Добавить пользователя',
      content: form,
      onClose: () => {
        this.addUserModal = null;
      },
    });

    this.addUserModal.open(modalRoot);
  };

  private handleRemoveUser = async (): Promise<void> => {
    const chatId = this.props.activeChatId;

    if (chatId === null) {
      return;
    }

    const modalRoot = this.refs.modalRoot as HTMLElement | undefined;

    if (!modalRoot || this.removeUserModal) {
      return;
    }

    try {
      const users = await chatsController.getChatUsers(chatId);

      const form = new RemoveUserForm({
        users,

        onRemoveUser: async (userId: number) => {
          try {
            await chatsController.removeUsers({
              users: [userId],
              chatId,
            });

            this.removeUserModal?.close();
            this.removeUserModal = null;
          } catch (error: unknown) {
            if (error instanceof HTTPError) {
              console.error(
                'Ошибка удаления пользователя:',
                error.response,
              );

              return;
            }

            console.error(
              'Не удалось удалить пользователя',
              error,
            );
          }
        },
      });

      this.removeUserModal = new Modal({
        title: 'Удалить пользователя',
        content: form,

        onClose: () => {
          this.removeUserModal = null;
        },
      });

      this.removeUserModal.open(modalRoot);
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        console.error(
          'Ошибка загрузки пользователей чата:',
          error.response,
        );

        return;
      }

      console.error(
        'Не удалось загрузить пользователей чата',
        error,
      );
    }
  };
}
