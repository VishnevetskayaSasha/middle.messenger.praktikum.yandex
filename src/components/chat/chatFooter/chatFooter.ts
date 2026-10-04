import { Block, type BlockOwnProps } from '../../../framework';

import template from './chatFooter.hbs?raw';
import { validateInput } from '../../../utils/formValidation';
import './chatFooter.scss';

interface ChatFooterProps extends BlockOwnProps {
  onSend: (message: string) => void;
}

export class ChatFooter extends Block<ChatFooterProps> {
  static componentName = 'ChatFooter';

  protected template = template;

  constructor(props: ChatFooterProps) {
    super(props);
  }

  protected componentDidMount(): void {
    const form = this.refs.messageForm as HTMLFormElement | undefined;
    const messageInput = form?.elements.namedItem('message') as HTMLInputElement | null;

    messageInput?.addEventListener('blur', this.handleMessageBlur);
    form?.addEventListener('submit', this.handleSubmit);
  }

  protected componentWillUnmount(): void {
    const form = this.refs.messageForm as HTMLFormElement | undefined;
    const messageInput = form?.elements.namedItem('message') as HTMLInputElement | null;

    messageInput?.removeEventListener('blur', this.handleMessageBlur);
    form?.removeEventListener('submit', this.handleSubmit);
  }

  private handleMessageBlur = (event: FocusEvent): void => {
    const input = event.currentTarget as HTMLInputElement;
    validateInput(input);
  };

  private handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const messageInput = form.elements.namedItem('message') as HTMLInputElement | null;

    if (!messageInput || !validateInput(messageInput)) {
      return;
    }

    this.props.onSend(messageInput.value);
    messageInput.value = '';
  };
}
