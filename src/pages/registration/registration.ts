import { Block, HTTPError } from '../../framework';
import { authController } from '../../controllers';
import type { SignUpData } from '../../api';
import { router } from '../../router';

import template from './registration.hbs?raw';
import { validatePasswordConfirmation } from '../../utils/validation';
import { showInputError, validateInput } from '../../utils/formValidation';

export class RegistrationPage extends Block {
  protected template = template;

  protected componentDidMount() {
    const form = this.element().querySelector('.auth__form') as HTMLFormElement | null;
    const inputs = form?.querySelectorAll<HTMLInputElement>('input');
    const passwordInput = form?.elements.namedItem('password') as HTMLInputElement | null;
    const confirmPasswordInput = form?.elements.namedItem('confirm_password') as HTMLInputElement | null;

    const validatePasswords = () => {
      if (!passwordInput || !confirmPasswordInput) {
        return false;
      }

      if (confirmPasswordInput.value.trim() === '') {
        return false;
      }

      const error = validatePasswordConfirmation(
        passwordInput.value,
        confirmPasswordInput.value,
      );

      showInputError(confirmPasswordInput, error);
      return !error;
    };


    inputs?.forEach((input) => {
      input.addEventListener('blur', () => {
        validateInput(input);

        if ( input.name === 'confirm_password') {
          validatePasswords();
        }
      });
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const isFormValid = Array.from(inputs ?? []).every((input) => validateInput(input));
      const isPasswordsValid = validatePasswords();

      if (!isFormValid || !isPasswordsValid) {
        return;
      }

      const formData = new FormData(form);
      formData.delete('confirm_password');

      const data = Object.fromEntries(
        formData.entries(),
      ) as unknown as SignUpData;

      try {
        await authController.signUp(data);
        const user = await authController.getUser();
        //console.log('Текущий пользователь:', user);
        router.setAuthorized(true);
        router.go('/messenger');
      } catch (error: unknown) {
        if (error instanceof HTTPError) {
          console.error(
            'Ошибка регистрации:',
            error.response,
          );

          return;
        }

        console.error(
          'Не удалось выполнить запрос регистрации',
          error,
        );
      }
    });
  }
}
