import {Block, type BlockOwnProps} from '../../../framework';
import { chatsController } from '../../../controllers';
import { formatMessageTime } from '../../../utils/formatMessageTime';
import { store } from '../../../store';

import template from './chatSidebar.hbs?raw';
import './chatSidebar.scss';

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

interface ChatSidebarProps extends BlockOwnProps {
  chats?: ChatView[];
  formError?: string;
  activeChatId: number | null;
  onCreateChat: () => void;
  onSelectChat: (chatId: number) => void;
}

export class ChatSidebar extends Block<ChatSidebarProps> {
  static componentName = 'ChatSidebar';

  protected template = template;

  private static activeInstance: ChatSidebar | null = null;
  private static cachedChats: ChatView[] = [];
  private static cachedFormError = '';

  private static chatsUpdateInterval: ReturnType<typeof setInterval> | null = null;

  constructor(props: ChatSidebarProps) {
    const chats = ChatSidebar.cachedChats.map((chat) => ({
      ...chat,
      isSelected: chat.id === props.activeChatId,
      unreadCount: chat.id === props.activeChatId ? 0 : chat.unreadCount,
      onClick: props.onSelectChat,
    }));

    super({
      ...props,
      chats,
      formError: ChatSidebar.cachedFormError,
    });
  }

  protected componentDidMount(): void {
    ChatSidebar.activeInstance = this;

    const createChatButton = this.refs.createChatButton as | HTMLButtonElement | undefined;
    createChatButton?.addEventListener('click', this.props.onCreateChat);

    if (ChatSidebar.cachedChats.length === 0) {
      void this.loadChats();
    }

    if (ChatSidebar.chatsUpdateInterval === null) {
      ChatSidebar.chatsUpdateInterval = setInterval(() => {
        const sidebar = ChatSidebar.activeInstance;

        if (sidebar) {
          void sidebar.loadChats();
        }
      }, 5000);
    }
  }

  protected componentWillUnmount(): void {
    if (ChatSidebar.activeInstance === this) {
      ChatSidebar.activeInstance = null;
    }
  }

  private async loadChats(): Promise<void> {
    try {
      const chats = await chatsController.getChats();
      const currentUserId = store.getState().user?.login;
      const chatViews: ChatView[] = chats.map((chat) => ({
        id: chat.id,
        name: chat.title,
        avatar: chat.avatar,
        unreadCount: chat.unread_count,
        lastMessage: chat.last_message
          ? {
              text: chat.last_message.content,
              time: formatMessageTime(chat.last_message.time),
              isOwn: chat.last_message.user.login === currentUserId,
            }
          : null,

        isSelected: chat.id === this.props.activeChatId,
        onClick: this.props.onSelectChat,
      }));

      ChatSidebar.cachedChats = chatViews;
      ChatSidebar.cachedFormError = '';

      this.setProps({
        chats: chatViews,
        formError: '',
      });
    } catch {
      ChatSidebar.cachedFormError =
        'Не удалось загрузить список чатов';

      this.setProps({
        formError:
          'Не удалось загрузить список чатов',
      });
    }
  }
}
