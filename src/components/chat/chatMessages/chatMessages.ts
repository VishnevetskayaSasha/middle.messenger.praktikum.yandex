import {Block, type BlockOwnProps} from '../../../framework';

import template from './chatMessages.hbs?raw';
import './chatMessages.scss';

interface ChatMessageView {
  id: number;
  content: string;
  time: string;
  isOwn: boolean;
}

interface ChatMessagesProps extends BlockOwnProps {
  messages: ChatMessageView[];
  hasMessages: boolean;
}

export class ChatMessages extends Block<ChatMessagesProps> {
  static componentName = 'ChatMessages';

  protected template = template;

  constructor(props: ChatMessagesProps) {
    super(props);
  }

  protected componentDidMount(): void {
    requestAnimationFrame(() => {
      const element = this.element();
      element.scrollTop = element.scrollHeight;
    });
  }
}
