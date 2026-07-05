import { Block, type BlockOwnProps } from '../../framework';
import template from './chats.hbs?raw';
import { chats } from '../../mocks/chats';
import { validateInput } from '../../utils/formValidation';

interface ChatsPageProps extends BlockOwnProps {
  chats: typeof chats;
}

export class ChatsPage extends Block<ChatsPageProps> {
  protected template = template;

  constructor() {
    super({ chats });
  }

  protected componentDidMount() {
    const form = this.refs.messageForm as HTMLFormElement;
    const messageInput = form?.elements.namedItem('message') as HTMLInputElement | null;

    messageInput?.addEventListener('blur', () => {
      validateInput(messageInput);
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!messageInput || !validateInput(messageInput)) {
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log(data);
      messageInput.value = '';
    });
  }
}