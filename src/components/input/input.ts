import { Block, type BlockOwnProps } from '../../framework';
import template from './input.hbs?raw';

interface InputProps extends BlockOwnProps {
  label: string;
  name: string;
  type: string;
  autocomplete?: string;
  modifier?: string;
  value?: string;
}

export class Input extends Block<InputProps> {
  static componentName = 'Input';

  protected template = template;

  constructor(props: InputProps) {
    super(props);
  }
}
