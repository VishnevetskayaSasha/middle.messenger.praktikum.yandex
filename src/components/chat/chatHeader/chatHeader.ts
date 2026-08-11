import {Block, type BlockOwnProps } from '../../../framework';

import template from './chatHeader.hbs?raw';
import './chatHeader.scss';

interface ChatHeaderProps extends BlockOwnProps {
  title: string;
  avatar?: string | null;
}

export class ChatHeader extends Block<ChatHeaderProps> {
  static componentName = 'ChatHeader';

  protected template = template;

  constructor(props: ChatHeaderProps) {
    super(props);
  }
}
