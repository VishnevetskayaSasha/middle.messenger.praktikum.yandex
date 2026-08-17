import { Block, type BlockOwnProps } from '../../framework';

import template from './chatItem.hbs?raw';

export interface ChatItemLastMessage {
  text: string;
  time: string;
  isOwn: boolean;
}

interface ChatItemProps extends BlockOwnProps {
  id: number;
  name: string;
  unreadCount: number;
  lastMessage: ChatItemLastMessage | null;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export class ChatItem extends Block<ChatItemProps> {
  static componentName = 'ChatItem';

  protected template = template;

  constructor(props: ChatItemProps) {
    super(props);
  }

  protected componentDidMount(): void {
    this.element().addEventListener('click', this.handleClick);
  }

  protected componentWillUnmount(): void {
    this.element().removeEventListener('click', this.handleClick);
  }

  private handleClick = (): void => {
    this.props.onClick(this.props.id);
  };
}
