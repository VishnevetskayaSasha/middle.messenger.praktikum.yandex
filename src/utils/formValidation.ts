import { validateField } from './validation';

export function showInputError(
  input: HTMLInputElement,
  error: string | null,
): void {
  const errorElement = input.closest('.input')?.querySelector('.input__error') ||
  input.closest('.profile-field')?.querySelector('.profile-field__error');

  if (errorElement) {
    errorElement.textContent = error ?? '';
  }

  input.classList.toggle('input__field_error', Boolean(error));

  const profileField = input.closest('.profile-field');
  profileField?.classList.toggle('profile__field_error',Boolean(error));
}

export function validateInput(input: HTMLInputElement): boolean {
  const error = validateField(input.name, input.value);
  showInputError(input, error);
  return !error;
}
