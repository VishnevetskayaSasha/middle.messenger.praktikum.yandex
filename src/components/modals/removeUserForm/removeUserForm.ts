import {Block, type BlockOwnProps} from '../../../framework';

import type { User } from '../../../api';
import { store } from '../../../store';
import template from './removeUserForm.hbs?raw';
import './removeUserForm.scss';

interface UserView extends User {
  buttonRef: string;
}

interface RemoveUserFormProps extends BlockOwnProps {
  users: UserView[];
  onRemoveUser: (userId: number) => void;
}

interface RemoveUserFormConstructorProps {
  users: User[];
  onRemoveUser: (userId: number) => void;
}

export class RemoveUserForm extends Block<RemoveUserFormProps> {
  protected template = template;

  constructor(props: RemoveUserFormConstructorProps) {
    const currentUserId = store.getState().user?.id;

    const users = props.users
      .filter((user) => user.id !== currentUserId)
      .map((user) => ({
        ...user,
        buttonRef: `removeUserButton-${user.id}`,
      }));

    super({
      users,
      onRemoveUser: props.onRemoveUser,
    });
  }

  protected componentDidMount(): void {
    this.initRemoveButtons();
  }

  private initRemoveButtons(): void {
    this.props.users.forEach((user) => {
      const button = this.refs[user.buttonRef] as | HTMLButtonElement | undefined;
      button?.addEventListener('click', () => {
          this.props.onRemoveUser(user.id);
        },
      );
    });
  }
}
