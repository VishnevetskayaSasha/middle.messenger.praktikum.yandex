import { Block } from '../../framework';
import template from './login.hbs?raw';
import { validateField } from '../../utils/validation';

export class LoginPage extends Block {
  protected template = template;

  protected componentDidMount() {
    const form = this.element()?.querySelector('.auth__form') as HTMLFormElement | null;

    const inputs = form?.querySelectorAll<HTMLInputElement>('input');

    const validateInput = (input: HTMLInputElement) => {
      const error = validateField(input.name, input.value);

      const errorElement = input.closest('.input')?.querySelector('.input__error');

      if (errorElement) {
        errorElement.textContent = error ?? '';
      }
      input.classList.toggle('input__field_error', Boolean(error));
      return !error;
    };


    inputs?.forEach((input) => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const isFormValid = Array.from(inputs ?? []).every((input) => {
        return validateInput(input);
      });

      if (!isFormValid) {
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log(data);
    });
  }
}
