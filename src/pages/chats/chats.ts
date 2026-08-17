import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import { chatsController } from '../../controllers';
import { CreateChatForm, Modal, AddUserForm, RemoveUserForm, DeleteChatForm } from '../../components/modals';
import { ChatSidebar } from '../../components/chat';
import { store } from '../../store';
import { ChatWebSocket, type ChatMessage } from '../../services';
import { formatMessageTime } from '../../utils/formatMessageTime';

import template from './chats.hbs?raw';

interface ChatsPageProps extends BlockOwnProps {
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
  onSelectChat?: (
    chatId: number,
    title: string,
    avatar: string | null,
  ) => void;
  onDeleteChat?: () => void;
  onActiveChatDeleted?: () => void;
}

export class ChatsPage extends Block<ChatsPageProps> {
  protected template = template;

  private createChatModal: Modal | null = null;
  private addUserModal: Modal | null = null;
  private chatWebSocket = new ChatWebSocket();
  private removeUserModal: Modal | null = null;
  private deleteChatModal: Modal | null = null;

  constructor() {
    super({
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
      onDeleteChat: this.handleDeleteChat,
      onActiveChatDeleted: this.resetActiveChat,
    });

    this.chatWebSocket.setOnMessage(
      this.handleWebSocketMessages,
    );
  }

  protected componentWillUnmount(): void {
    this.createChatModal?.close();
    this.createChatModal = null;


    this.addUserModal?.close();
    this.addUserModal = null;

    this.removeUserModal?.close();
    this.removeUserModal = null;

    this.deleteChatModal?.close();
    this.deleteChatModal = null;
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
        this.createChatModal = null;
        ChatSidebar.refresh();
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

  private selectChat = (
    chatId: number,
    title: string,
    avatar: string | null,
  ): void => {
    this.setProps({
      activeChatId: chatId,
      activeChatTitle: title,
      activeChatAvatar: avatar,
      messages: [],
      messageViews: [],
      hasMessages: false,
    });

    void this.loadChatToken(chatId);
  };


  private handleSendMessage = (message: string): void => {
    //console.log('handleSendMessage:', message);
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
          ChatSidebar.refresh();
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
            ChatSidebar.refresh();
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

  private handleDeleteChat = (): void => {
    const chatId = this.props.activeChatId;

    if (chatId === null) {
      return;
    }

    const modalRoot = this.refs.modalRoot as HTMLElement | undefined;

    if (!modalRoot || this.deleteChatModal) {
      return;
    }

    const form = new DeleteChatForm({
      onSubmit: async () => {
        try {
          await chatsController.deleteChat({
            chatId,
          });

          this.deleteChatModal?.close();
          this.deleteChatModal = null;

          this.resetActiveChat();

          ChatSidebar.refresh();
        } catch (error: unknown) {
          if (error instanceof HTTPError) {
            console.error(
              'Ошибка удаления чата:',
              error.response,
            );
          if (error.status === 403) {
            form.setProps({
              error:
                'Вы не являетесь создателем чата, удалить его не получится.',
            });
          }

            return;
          }

          console.error(
            'Не удалось удалить чат',
            error,
          );
        }
      },
    });

    this.deleteChatModal = new Modal({
      title: 'Удалить чат',
      content: form,
      onClose: () => {
        this.deleteChatModal = null;
      },
    });

    this.deleteChatModal.open(modalRoot);
  };

  private resetActiveChat = (): void => {
    this.chatWebSocket.disconnect();

    this.setProps({
      activeChatId: null,
      activeChatTitle: '',
      activeChatAvatar: null,
      messages: [],
      messageViews: [],
      hasMessages: false,
    });
  };
}
