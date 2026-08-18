import {Block, type BlockOwnProps } from '../../../framework';

import template from './chatHeader.hbs?raw';
import './chatHeader.scss';

interface ChatHeaderProps extends BlockOwnProps {
  title: string;
  avatar?: string | null;
  isMenuOpen: boolean;
  onAddUser: () => void;
  onRemoveUser: () => void;
  onDeleteChat: () => void;
}

type ChatHeaderConstructorProps = Omit<ChatHeaderProps, 'isMenuOpen'>;

export class ChatHeader extends Block<ChatHeaderProps> {
  static componentName = 'ChatHeader';

  protected template = template;

  constructor(props: ChatHeaderConstructorProps) {
    super({
      ...props,
      isMenuOpen: false,
    });
  }

  protected componentDidMount(): void {
    const menuButton = this.refs.menuButton as | HTMLButtonElement | undefined;
    const addUserButton = this.refs.addUserButton as | HTMLButtonElement | undefined;
    const removeUserButton = this.refs.removeUserButton as | HTMLButtonElement | undefined;
    const deleteChatButton = this.refs.deleteChatButton as | HTMLButtonElement | undefined;

    menuButton?.addEventListener('click', this.toggleMenu);
    addUserButton?.addEventListener('click', this.handleAddUser);
    removeUserButton?.addEventListener('click', this.handleRemoveUser);
    document.addEventListener('click', this.handleDocumentClick);
    deleteChatButton?.addEventListener('click', this.handleDeleteChat);
  }

  protected componentWillUnmount(): void {
    const menuButton = this.refs.menuButton as | HTMLButtonElement | undefined;
    const addUserButton = this.refs.addUserButton as | HTMLButtonElement | undefined;
    const removeUserButton = this.refs.removeUserButton as | HTMLButtonElement | undefined;
    const deleteChatButton = this.refs.deleteChatButton as | HTMLButtonElement | undefined;

    menuButton?.removeEventListener('click', this.toggleMenu);
    addUserButton?.removeEventListener('click', this.handleAddUser);
    removeUserButton?.removeEventListener('click', this.handleRemoveUser);
    document.removeEventListener('click', this.handleDocumentClick);
    deleteChatButton?.removeEventListener('click', this.handleDeleteChat);
  }

  private toggleMenu = (event: MouseEvent): void => {
    event.stopPropagation();

    this.setProps({
      isMenuOpen: !this.props.isMenuOpen,
    });
  };

  private handleAddUser = (): void => {
    this.setProps({
      isMenuOpen: false,
    });

    this.props.onAddUser();
  };

  private handleRemoveUser = (): void => {
    this.setProps({
      isMenuOpen: false,
    });

    this.props.onRemoveUser();
  };

  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.props.isMenuOpen) {
      return;
    }

    const menuWrapper = this.refs.menuWrapper as HTMLElement | undefined;
    const target = event.target as Node;

    if (menuWrapper?.contains(target)) {
      return;
    }

    this.setProps({
      isMenuOpen: false,
    });
  };

  private handleDeleteChat = (): void => {
    this.setProps({
      isMenuOpen: false,
    });

    this.props.onDeleteChat();
  };
}
