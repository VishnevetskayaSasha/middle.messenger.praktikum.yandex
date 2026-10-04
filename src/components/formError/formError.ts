import { Block, type BlockOwnProps} from '../../framework';
import template from './formError.hbs?raw';
import './formError.scss';

interface FormErrorProps extends BlockOwnProps {
  text: string;
}

export class FormError extends Block<FormErrorProps> {
  static componentName = 'FormError';
  protected template = template;

  constructor(props: FormErrorProps) {
    super(props);
  }
}
