import { Block, type BlockOwnProps } from '../../framework';
import template from './profileField.hbs?raw';

interface ProfileFieldProps extends BlockOwnProps {
  label: string;
  name: string;
  type: string;
  value: string;
  isEditable?: boolean;
}

export class ProfileField extends Block<ProfileFieldProps> {
  static componentName = 'ProfileField';

  protected template = template;

  constructor(props: ProfileFieldProps) {
    super(props);
  }
}
