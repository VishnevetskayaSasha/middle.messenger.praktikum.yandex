import { Block, type BlockOwnProps } from '../../framework';
import template from './link.hbs?raw';

interface LinkProps extends BlockOwnProps {
  href: string;
  text: string;
  modifier?: string;
}

export class Link extends Block<LinkProps> {
  static componentName = 'Link';

  protected template = template;

  constructor(props: LinkProps) {
    super(props);
  }
}