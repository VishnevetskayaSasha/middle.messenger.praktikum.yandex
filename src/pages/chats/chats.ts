import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import template from './chats.hbs?raw';
import { chatsController } from '../../controllers';
import { CreateChatForm, Modal } from '../../components/modals';

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
}

export class ChatsPage extends Block<ChatsPageProps> {
  protected template = template;

  private createChatModal: Modal | null = null;

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
    const { token } = await chatsController.getChatToken(chatId);
    console.log('Chat token:', token);
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
}
