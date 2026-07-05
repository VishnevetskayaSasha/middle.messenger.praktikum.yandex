import { Block, type BlockOwnProps } from '../../framework';
import template from './chatItem.hbs?raw';

interface ChatItemProps extends BlockOwnProps {
  id: number;
  name: string;
  unreadCount: number;
  lastMessage: {
    author: string;
    text: string;
    time: string;
  };
}

export class ChatItem extends Block<ChatItemProps> {
  static componentName = 'ChatItem';

  protected template = template;

  constructor(props: ChatItemProps) {
    super(props);
  }
}
