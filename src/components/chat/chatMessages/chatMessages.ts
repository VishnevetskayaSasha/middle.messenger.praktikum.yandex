import {
  Block,
  type BlockOwnProps,
} from '../../../framework';

import template from './chatMessages.hbs?raw';
import './chatMessages.scss';

interface ChatMessagesProps extends BlockOwnProps {
  hasMessages: boolean;
}

export class ChatMessages extends Block<ChatMessagesProps> {
  static componentName = 'ChatMessages';

  protected template = template;

  constructor(props: ChatMessagesProps) {
    super(props);
  }
}
