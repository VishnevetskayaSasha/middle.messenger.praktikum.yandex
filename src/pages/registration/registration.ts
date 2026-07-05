import { Block } from '../../framework';
import template from './registration.hbs?raw';
import { validatePasswordConfirmation } from '../../utils/validation';
import { showInputError, validateInput } from '../../utils/formValidation';

export class RegistrationPage extends Block {
  protected template = template;

  protected componentDidMount() {
    const form = this.element()?.querySelector('.auth__form') as HTMLFormElement | null;
    const inputs = form?.querySelectorAll<HTMLInputElement>('input');
    const passwordInput = form?.elements.namedItem('password') as HTMLInputElement | null;
    const confirmPasswordInput = form?.elements.namedItem('confirm_password') as HTMLInputElement | null;

    const validatePasswords = () => {
      if (!passwordInput || !confirmPasswordInput) {
        return true;
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

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const isFormValid = Array.from(inputs ?? []).every((input) => validateInput(input));
      const isPasswordsValid = validatePasswords();

      if (!isFormValid || !isPasswordsValid) {
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log(data);
    });
  }
}