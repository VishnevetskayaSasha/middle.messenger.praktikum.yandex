import { Block, type BlockOwnProps } from '../../../framework';
import { chatsController } from '../../../controllers';
import { formatMessageTime } from '../../../utils/formatMessageTime';
import { store } from '../../../store';
import type { Chat } from '../../../api';

import template from './chatSidebar.hbs?raw';
import './chatSidebar.scss';

interface ChatData {
  id: number;
  name: string;
  avatar: string | null;
  unreadCount: number;
  lastMessage: {
    text: string;
    time: string;
    isOwn: boolean;
  } | null;
}

interface ChatView extends ChatData {
  isSelected: boolean;
  onClick: (id: number) => void;
}

interface ChatSidebarProps extends BlockOwnProps {
  chats?: ChatView[];
  formError?: string;
  searchValue?: string;
  hasSearchResults?: boolean;
  activeChatId: number | null;
  onCreateChat: () => void;
  onSelectChat: (
    chatId: number,
    title: string,
    avatar: string | null,
  ) => void;
  onActiveChatDeleted: () => void;
}

export class ChatSidebar extends Block<ChatSidebarProps> {
  static componentName = 'ChatSidebar';

  protected template = template;

  private static activeInstance: ChatSidebar | null = null;
  private static cachedChats: ChatData[] = [];
  private static cachedFormError = '';
  private static cachedUserId: number | null = null;
  private static hasLoadedOnce = false;
  private static chatsUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private searchValue = '';

  constructor(props: ChatSidebarProps) {
    const currentUserId = store.getState().user?.id ?? null;

    if (ChatSidebar.cachedUserId !== currentUserId) {
      ChatSidebar.cachedUserId = currentUserId;
      ChatSidebar.cachedChats = [];
      ChatSidebar.cachedFormError = '';
      ChatSidebar.hasLoadedOnce = false;
    }

    const handleCachedChatClick = (chatId: number): void => {
      const chat = ChatSidebar.cachedChats.find(
        (item) => item.id === chatId,
      );

      if (!chat) {
        return;
      }

      props.onSelectChat(
        chat.id,
        chat.name,
        chat.avatar,
      );
    };

    const chats: ChatView[] = ChatSidebar.cachedChats.map((chat) => ({
      ...chat,
      unreadCount: chat.id === props.activeChatId ? 0 : chat.unreadCount,
      isSelected: chat.id === props.activeChatId,
      onClick: handleCachedChatClick,
    }));

    super({
      ...props,
      chats,
      formError: ChatSidebar.cachedFormError,
      searchValue: '',
      hasSearchResults: chats.length > 0,
    });
  }

  public static refresh(): void {
    const sidebar = ChatSidebar.activeInstance;

    if (sidebar) {
      void sidebar.loadChats();
    }
  }

  protected componentDidMount(): void {
    ChatSidebar.activeInstance = this;
    const createChatButton = this.refs.createChatButton as | HTMLButtonElement | undefined;
    createChatButton?.addEventListener('click', this.props.onCreateChat);

    const searchInput = this.refs.searchInput as | HTMLInputElement | undefined;
    searchInput?.addEventListener('input', this.handleSearchInput);

    if (!ChatSidebar.hasLoadedOnce) {
      void this.loadChats();
    }

    if (ChatSidebar.chatsUpdateInterval === null) {
      ChatSidebar.chatsUpdateInterval = setInterval(() => {
        const sidebar = ChatSidebar.activeInstance;

        if (sidebar && sidebar.element().isConnected) {
          void sidebar.loadChats();
        }
      }, 5000);
    }
  }

  protected componentWillUnmount(): void {
    const createChatButton = this.refs.createChatButton as | HTMLButtonElement | undefined;
    createChatButton?.removeEventListener('click', this.props.onCreateChat);

    const searchInput = this.refs.searchInput as | HTMLInputElement | undefined;
    searchInput?.removeEventListener( 'input', this.handleSearchInput);

    if (ChatSidebar.activeInstance === this) {
      ChatSidebar.activeInstance = null;
    }
  }

  private async loadChats(): Promise<void> {
    let chats: Chat[];

    try {
      chats = await chatsController.getChats();
    } catch {
      ChatSidebar.hasLoadedOnce = true;
      ChatSidebar.cachedFormError = 'Не удалось загрузить список чатов';

      if ( ChatSidebar.activeInstance === this) {
        this.setProps({
          formError: ChatSidebar.cachedFormError,
        });
      }

      return;
    }

    ChatSidebar.hasLoadedOnce = true;

    if (ChatSidebar.activeInstance !== this) {
      return;
    }

    const currentUserLogin = store.getState().user?.login;

    const chatData: ChatData[] =
      chats.map((chat) => ({
        id: chat.id,
        name: chat.title,
        avatar: chat.avatar,
        unreadCount: chat.unread_count,
        lastMessage: chat.last_message
          ? {
              text: chat.last_message.content,
              time: formatMessageTime(chat.last_message.time),
              isOwn: chat.last_message.user.login === currentUserLogin,
            }
          : null,
      }));

    ChatSidebar.cachedChats = chatData;
    ChatSidebar.cachedFormError = '';

    const activeChatId = this.props.activeChatId;

    if ( activeChatId !== null &&
      !chatData.some((chat) => chat.id === activeChatId)
    ) {
      this.props.onActiveChatDeleted();
      return;
    }

    const searchInput = this.refs.searchInput as | HTMLInputElement | undefined;
    const shouldRestoreSearchFocus = document.activeElement === searchInput;
    this.updateVisibleChats(shouldRestoreSearchFocus);
  }

  private handleSelectChat = ( chatId: number): void => {
    const chat = ChatSidebar.cachedChats.find((item) => item.id === chatId);

    if (!chat) {
      return;
    }

    this.props.onSelectChat(
      chat.id,
      chat.name,
      chat.avatar,
    );
  };

  private handleSearchInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
    this.updateVisibleChats(true);
  };

  private updateVisibleChats(restoreFocus = false): void {
    const normalizedSearch = this.searchValue.trim().toLowerCase();
    const filteredChats = ChatSidebar.cachedChats.filter((chat) =>
      chat.name.toLowerCase().includes(normalizedSearch),
    );

    const chatViews: ChatView[] =
      filteredChats.map((chat) => ({
        ...chat,
        unreadCount: chat.id === this.props.activeChatId ? 0 : chat.unreadCount,
        isSelected: chat.id === this.props.activeChatId,
        onClick: this.handleSelectChat,
      }));

    this.setProps({
      chats: chatViews,
      formError: ChatSidebar.cachedFormError,
      hasSearchResults: chatViews.length > 0,
      searchValue: this.searchValue,
    });
    if (restoreFocus) {
      requestAnimationFrame(() => {
        const searchInput = this.refs.searchInput as | HTMLInputElement | undefined;

        if (!searchInput) {
          return;
        }

        searchInput.focus();
        const position = searchInput.value.length;
        searchInput.setSelectionRange(position, position);
      });
    }
  }
}
