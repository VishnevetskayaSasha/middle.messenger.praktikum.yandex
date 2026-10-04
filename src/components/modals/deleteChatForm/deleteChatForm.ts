import {Block, type BlockOwnProps} from '../../../framework';

import template from './deleteChatForm.hbs?raw';
import './deleteChatForm.scss';

interface DeleteChatFormProps extends BlockOwnProps {
  onSubmit: () => void;
  error?: string;
}

export class DeleteChatForm extends Block<DeleteChatFormProps> {
  protected template = template;

  constructor(props: DeleteChatFormProps) {
    super(props);
  }

  protected componentDidMount(): void {
    const deleteButton = this.refs.deleteButton as | HTMLButtonElement | undefined;
    deleteButton?.addEventListener('click', this.props.onSubmit);
  }
}
