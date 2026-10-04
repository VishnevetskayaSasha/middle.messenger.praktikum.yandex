import { Block, type BlockOwnProps } from '../../../framework';

import template from './createChatForm.hbs?raw';
import './createChatForm.scss';

interface CreateChatFormProps extends BlockOwnProps {
  formError: string;
  onSubmit: (title: string) => Promise<void>;
}

type CreateChatFormConstructorProps = Omit<CreateChatFormProps, 'formError'>;

export class CreateChatForm extends Block<CreateChatFormProps> {
  protected template = template;

  constructor(props: CreateChatFormConstructorProps) {
    super({
      ...props,
      formError: '',
    });
  }

  protected componentDidMount(): void {
    const form = this.element() as HTMLFormElement;
    form.addEventListener('submit', this.handleSubmit);
  }

  protected componentWillUnmount(): void {
    const form = this.element() as HTMLFormElement;

    form.removeEventListener('submit', this.handleSubmit);
  }

  private handleSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const titleInput = form.elements.namedItem('title') as HTMLInputElement | null;
    const title = titleInput?.value.trim() ?? '';

    if (!title) {
      this.setProps({
        formError: 'Введите название чата.',
      });

      return;
    }

    try {
      await this.props.onSubmit(title);
    } catch {
      this.setProps({
        formError: 'Не удалось создать чат.',
      });
    }
  };
}
