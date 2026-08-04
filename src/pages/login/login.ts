import { Block, HTTPError, type BlockOwnProps } from '../../framework';
import { authController } from '../../controllers';
import type { SignInData } from '../../api';
import { router } from '../../router';

import template from './login.hbs?raw';
import { validateInput } from '../../utils/formValidation';
import { getApiErrorReason } from '../../utils/getApiErrorReason';

interface LoginPageProps extends BlockOwnProps {
  formError: string;
}

export class LoginPage extends Block<LoginPageProps> {
  protected template = template;

  constructor() {
    super({
      formError: '',
    });
  }

  protected componentDidMount() {
    const form = this.element().querySelector('.auth__form') as HTMLFormElement | null;

    const inputs = form?.querySelectorAll<HTMLInputElement>('input');

    inputs?.forEach((input) => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const isFormValid = Array.from(inputs ?? []).every((input) => {
        return validateInput(input);
      });

      if (!isFormValid) {
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()) as unknown as SignInData;

      try {
        await authController.signIn(data);
        router.setAuthorized(true);
        router.go('/messenger');
      } catch (error: unknown) {
        if (error instanceof HTTPError) {
          this.setProps({
            formError: this.getAuthErrorMessage(error),
          });

          return;
        }

        this.setProps({
          formError: 'Не удалось войти. Попробуйте ещё раз.',
        });
      }
    });
  }
  
  private getAuthErrorMessage(error: HTTPError): string {
    const reason = getApiErrorReason(error);

    if (reason === 'Login or password is incorrect') {
      return 'Неверный логин или пароль.';
    }

    return 'Не удалось войти. Попробуйте ещё раз.';
  }
}
