import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import template from './profile.hbs?raw';
import { showInputError, validateInput } from '../../utils/formValidation';
import { validatePasswordConfirmation } from '../../utils/validation';

import { authController } from '../../controllers';
import { router } from '../../router';

type ProfileMode = 'view' | 'edit-data' | 'edit-password';

interface ProfileUser {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
}

interface ProfilePageProps extends BlockOwnProps {
  mode: ProfileMode;
  user: ProfileUser;
  isViewMode: boolean;
  isEditDataMode: boolean;
  isEditPasswordMode: boolean;
}

export class ProfilePage extends Block<ProfilePageProps> {
  protected template = template;

  constructor() {
    super({
      mode: 'view',
      user: {
        email: 'pochta@yandex.ru',
        login: 'ivanivanov',
        first_name: 'Иван',
        second_name: 'Иванов',
        display_name: 'Иван',
        phone: '+79099673030',
      },
      isViewMode: true,
      isEditDataMode: false,
      isEditPasswordMode: false,
    });
  }

  private setMode(mode: ProfileMode, user = this.props.user) {
    this.setProps({
      mode,
      user,
      isViewMode: mode === 'view',
      isEditDataMode: mode === 'edit-data',
      isEditPasswordMode: mode === 'edit-password',
    });
  }

  protected componentDidMount() {
    this.initEditDataMode();
    this.initEditPasswordMode();
    this.initDataForm();
    this.initPasswordForm();
    this.initLogout();
  }

  private initEditDataMode() {
    const editDataLink = this.refs.editDataLink as HTMLAnchorElement;

    editDataLink?.addEventListener('click', (event) => {
      event.preventDefault();
      this.setMode('edit-data');
    });
  }

  private initEditPasswordMode() {
    const editPasswordLink = this.refs.editPasswordLink as HTMLAnchorElement;
    editPasswordLink?.addEventListener('click', (event) => {
      event.preventDefault();
      this.setMode('edit-password');
    });
  }

  private initDataForm() {
    const dataForm = this.refs.dataForm as HTMLFormElement;
    const dataInputs = dataForm?.querySelectorAll<HTMLInputElement>('input');

    dataInputs?.forEach((input) => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
    });

    dataForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const isFormValid = Array.from(dataInputs ?? []).every((input) => validateInput(input));

      if (!isFormValid) {
        return;
      }

      const formData = new FormData(dataForm);
      const data = Object.fromEntries(formData.entries()) as unknown as ProfileUser;

      console.log(data);
      this.setMode('view', data);
    });
  }

  private initPasswordForm() {
    const passwordForm = this.refs.passwordForm as HTMLFormElement;

    if (!passwordForm) {
      return;
    }

    const inputs = passwordForm.querySelectorAll<HTMLInputElement>('input');
    const newPassword = passwordForm.elements.namedItem('new_password') as HTMLInputElement;
    const repeatPassword = passwordForm.elements.namedItem('repeat_password') as HTMLInputElement;

    const validatePasswords = () => {
      if (repeatPassword.value.trim() === '') {
        return false;
      }

      const error = validatePasswordConfirmation(
        newPassword.value,
        repeatPassword.value,
      );

      showInputError(repeatPassword, error);
      return !error;
    };

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        validateInput(input);

        if (input.name === 'repeat_password') {
          validatePasswords();
        }
      });
    });

    passwordForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isFormValid = Array.from(inputs).every((input) =>
        validateInput(input),
      );

      const isPasswordsValid = validatePasswords();

      if (!isFormValid || !isPasswordsValid) {
        return;
      }

      const formData = new FormData(passwordForm);
      console.log(Object.fromEntries(formData.entries()));
      this.setMode('view');
    });
  }

  private initLogout(): void {
    const logoutLink = this.refs.logoutLink as HTMLAnchorElement | undefined;
    logoutLink?.addEventListener('click', async (event) => {
      event.preventDefault();

      try {
        await authController.logout();
        router.setAuthorized(false);
        router.go('/');
      } catch (error: unknown) {
        if (error instanceof HTTPError) {
          console.error(
            'Ошибка выхода из системы:',
            error.response,
          );

          return;
        }

        console.error(
          'Не удалось выйти из системы',
          error,
        );
      }
    });
  }
}
