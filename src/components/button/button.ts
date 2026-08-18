import { Block, type BlockOwnProps } from '../../framework';
import template from './button.hbs?raw';

interface ButtonProps extends BlockOwnProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  modifier?: string;
  ref?: string;
}

export class Button extends Block<ButtonProps> {
  static componentName = 'Button';
  protected template = template;

  constructor(props: ButtonProps) {
    super(props);
  }
}
