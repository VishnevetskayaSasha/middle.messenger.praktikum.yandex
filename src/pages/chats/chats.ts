import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import { chatsController } from '../../controllers';
import { CreateChatForm, Modal, AddUserForm, RemoveUserForm } from '../../components/modals';
import { store } from '../../store';
import { ChatWebSocket, type ChatMessage } from '../../services';
import { formatMessageTime } from '../../utils/formatMessageTime';

import template from './chats.hbs?raw';

interface ChatView {
  id: number;
  name: string;
  avatar: string | null;
  unreadCount: number;
  lastMessage: {
    text: string;
    time: string;
    isOwn: boolean;
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
  messages: ChatMessage[];
  messageViews: {
    id: number;
    content: string;
    time: string;
    isOwn: boolean;
  }[];
  hasMessages: boolean;
  onSendMessage?: (message: string) => void;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onCreateChat?: () => void;
  onSelectChat?: (chatId: number) => void
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
      messages: [],
      messageViews: [],
      hasMessages: false,
    });

    this.setProps({
      onSendMessage: this.handleSendMessage,
      onAddUser: this.openAddUserModal,
      onRemoveUser: this.handleRemoveUser,
      onCreateChat: this.openCreateChatModal,
      onSelectChat: this.selectChat,
    });

    this.chatWebSocket.setOnMessage(
      this.handleWebSocketMessages,
    );
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
      const currentUserLogin = store.getState().user?.login;

      const chatViews: ChatView[] = chats.map(
        (chat) => ({
          id: chat.id,
          name: chat.title,
          avatar: chat.avatar,
          unreadCount: chat.unread_count,
          lastMessage:chat.last_message
            ? {
                text: chat.last_message.content,
                time: formatMessageTime(chat.last_message.time),
                isOwn: chat.last_message.user.login === currentUserLogin,
              }
            : null,
          isSelected: chat.id === this.props.activeChatId,
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
      messages: [],
    });

    this.clearUnreadCount(chatId);
  };

  private clearUnreadCount(chatId: number): void {
    const chats = this.props.chats.map((chat) => ({
      ...chat,
      unreadCount: chat.id === chatId ? 0 : chat.unreadCount,
    }));

    this.setProps({
      chats,
    });
  }

  private handleSendMessage = (message: string): void => {
    console.log('handleSendMessage:', message);
    this.chatWebSocket.sendMessage(message);
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

  private handleWebSocketMessages = (messages: ChatMessage[], isHistory: boolean): void => {
    const nextMessages = isHistory ? [...messages].reverse() : [
          ...this.props.messages,
          ...messages,
        ];

    this.setProps({
      messages: nextMessages,
      messageViews: this.createMessageViews(nextMessages),
      hasMessages: nextMessages.length > 0,
    });
  };

  private createMessageViews(messages: ChatMessage[]) {
    const currentUserId = store.getState().user?.id;

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      time: formatMessageTime(message.time),
      isOwn: message.user_id === currentUserId,
    }));
  }
}
