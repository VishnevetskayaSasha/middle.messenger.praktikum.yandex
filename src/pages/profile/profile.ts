import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import template from './profile.hbs?raw';
import { showInputError, validateInput } from '../../utils/formValidation';
import { validatePasswordConfirmation } from '../../utils/validation';

import { authController, userController  } from '../../controllers';
import type { UpdateProfileData, ChangePasswordData, User } from '../../api';
import { router } from '../../router';
import { getApiErrorReason } from '../../utils/getApiErrorReason';

type ProfileMode = 'view' | 'edit-data' | 'edit-password';

interface ProfilePageProps extends BlockOwnProps {
  mode: ProfileMode;
  user: User;
  userDisplayName: string;
  profileFormError: string;
  passwordFormError: string;
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
        id: 0,
        email: '',
        login: '',
        first_name: '',
        second_name: '',
        display_name: null,
        phone: '',
        avatar: null,
      },
      userDisplayName: '',
      profileFormError: '',
      passwordFormError: '',
      isViewMode: true,
      isEditDataMode: false,
      isEditPasswordMode: false,
    });
  }

  private setMode(mode: ProfileMode, user = this.props.user) {
    this.setProps({
      mode,
      user,
      userDisplayName: user.display_name ?? user.first_name,
      profileFormError: '',
      passwordFormError: '',
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

    if (this.props.user.id === 0) {
      void this.loadUser();
    }
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
    if (!this.props.isEditDataMode) {
      return;
    }

    const dataForm = this.refs.dataForm as HTMLFormElement;
    const dataInputs = dataForm?.querySelectorAll<HTMLInputElement>('input');

    dataInputs?.forEach((input) => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
    });

    dataForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const isFormValid = Array.from(dataInputs ?? []).every((input) => validateInput(input));

      if (!isFormValid) {
        return;
      }

      const formData = new FormData(dataForm);
      const data = Object.fromEntries(formData.entries()) as unknown as UpdateProfileData;


      try {
        const user = await userController.updateProfile(data);
        this.setMode('view', user);
      } catch (error: unknown) {
        if (error instanceof HTTPError) {
          this.setProps({
            profileFormError:
              this.getProfileErrorMessage(error),
          });
          return;
        }

        this.setProps({
          profileFormError:
            'Не удалось сохранить изменения.',
        });
      }
    });
  }

  private getProfileErrorMessage(error: HTTPError): string {
    const reason = getApiErrorReason(error);

    if (reason === 'Login already exists') {
      return 'Пользователь с таким логином уже существует.';
    }

    if (reason === 'Email already exists') {
      return 'Пользователь с такой почтой уже существует.';
    }

    return 'Не удалось сохранить изменения.';
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

    passwordForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const isFormValid = Array.from(inputs).every((input) =>
        validateInput(input)
      );

      const isPasswordsValid = validatePasswords();

      if (!isFormValid || !isPasswordsValid) {
        return;
      }

      const oldPassword = passwordForm.elements.namedItem(
        'old_password',
      ) as HTMLInputElement;

      const data: ChangePasswordData = {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      };

      try {
        await userController.changePassword(data);
        this.setMode('view');
      } catch (error: unknown) {
        if (error instanceof HTTPError) {
          this.setProps({
            passwordFormError:
              this.getPasswordErrorMessage(error),
          });

          return;
        }

        this.setProps({
          passwordFormError:
            'Не удалось изменить пароль.',
        });
      }
    });
  }

  private getPasswordErrorMessage(error: HTTPError): string {
    const reason = getApiErrorReason(error);

    if (
      reason === 'Password is incorrect' ||
      reason === 'Old password is incorrect'
    ) {
      return 'Неверный текущий пароль.';
    }

    return 'Не удалось изменить пароль.';
  }

  private initLogout() {
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

  private async loadUser(): Promise<void> {
    try {
      const user = await userController.getUser();
      this.setProps({user, userDisplayName: user.display_name ?? user.first_name,});
    } catch (error: unknown) {
      console.error(
        'Не удалось загрузить данные пользователя',
        error,
      );
    }
  }
}
