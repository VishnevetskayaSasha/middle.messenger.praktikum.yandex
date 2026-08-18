import { Block, type BlockOwnProps} from '../../../framework';

import template from './chatMessage.hbs?raw';
import './chatMessage.scss';

interface ChatMessageProps extends BlockOwnProps {
  content: string;
  time: string;
  isOwn: boolean;
}

export class ChatMessage extends Block<ChatMessageProps> {
  static componentName = 'ChatMessage';

  protected template = template;

  constructor(props: ChatMessageProps) {
    super(props);
  }
}
