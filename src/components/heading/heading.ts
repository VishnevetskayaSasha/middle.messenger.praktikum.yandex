import { Block, type BlockOwnProps } from '../../framework';
import template from './heading.hbs?raw';

interface HeadingProps extends BlockOwnProps {
  text: string;
  modifier?: string;
}

export class Heading extends Block<HeadingProps> {
  static componentName = 'Heading';

  protected template = template;

  constructor(props: HeadingProps) {
    super(props);
  }
}
