import {Block, type BlockOwnProps} from '../../../framework';

import template from './addUserForm.hbs?raw';
import { userController } from '../../../controllers';
import type { User } from '../../../api';
import './addUserForm.scss';

interface UserView extends User {
  buttonRef: string;
}

interface AddUserFormProps extends BlockOwnProps {
  error: string;
  users: UserView[];
  login: string;
  onSelectUser: (userId: number) => void;
}

type AddUserFormConstructorProps = Pick<AddUserFormProps, 'onSelectUser'>;

export class AddUserForm extends Block<AddUserFormProps> {
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  protected template = template;

  constructor(props: AddUserFormConstructorProps) {
    super({
      ...props,
      error: '',
      users: [],
      login: '',
    });
  }

  protected componentDidMount(): void {
    const form = this.refs.form as HTMLFormElement | undefined;
    const loginInput = form?.elements.namedItem('login') as HTMLInputElement | null;

    loginInput?.addEventListener('input', this.handleLoginInput);
    this.initUserButtons();

    if (this.props.login && loginInput) {
      loginInput.focus();

      const cursorPosition = loginInput.value.length;

      loginInput.setSelectionRange(
        cursorPosition,
        cursorPosition,
      );
    }
  }

  protected componentWillUnmount(): void {
    const form = this.refs.form as HTMLFormElement | undefined;
    const loginInput = form?.elements.namedItem('login') as HTMLInputElement | null;

    loginInput?.removeEventListener('input', this.handleLoginInput);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private initUserButtons(): void {
    this.props.users.forEach((user) => {
      const button = this.refs[user.buttonRef] as | HTMLButtonElement | undefined;

      button?.addEventListener('click', () => {
          this.props.onSelectUser(user.id);
        },
      );
    });
  }

  private handleLoginInput = (event: Event): void => {
    const input = event.currentTarget as HTMLInputElement;
    const login = input.value.trim();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!login) {
      this.setProps({
        users: [],
        error: '',
        login: ''
      });

      return;
    }

    this.searchTimeout = setTimeout(() => {
      void this.searchUsers(login);
    }, 350);
  };

  private async searchUsers(login: string): Promise<void> {
    try {
      const users = await userController.searchUsers({
          login,
        });

      const userViews = users.map((user) => ({
        ...user,
        buttonRef: `user-${user.id}`,
      }));

      this.setProps({
        users: userViews,
        error:
          userViews.length === 0
            ? 'Пользователь не найден.'
            : '',
        login,
      });
    } catch {
      this.setProps({
        login,
        users: [],
        error:
          'Не удалось выполнить поиск пользователя.',
      });
    }
  }
}
