import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('должен отображать переданные label, name и type', () => {
    const input = new Input({
      label: 'Логин',
      name: 'login',
      type: 'text',
    });

    const element = input.element();
    const field = element.querySelector('input');
    const label = element.querySelector('label');

    expect(label?.textContent?.trim()).toBe('Логин');
    expect(field?.getAttribute('name')).toBe('login');
    expect(field?.getAttribute('type')).toBe('text');
  });

  it('должен добавлять modifier в класс поля ввода', () => {
    const input = new Input({
      label: 'Логин',
      name: 'login',
      type: 'text',
      modifier: 'profile',
    });

    const element = input.element();

    expect(element.classList.contains('input_profile')).toBe(true);
  });

  it('должен отображать переданное value', () => {
    const input = new Input({
      label: 'Логин',
      name: 'login',
      type: 'text',
      value: 'Alex',
    });

    const element = input.element();
    const field = element.querySelector('input');

    expect(field?.getAttribute('value')).toBe('Alex');
  });

  it('должен добавлять autocomplete, если он передан', () => {
    const input = new Input({
      label: 'Пароль',
      name: 'password',
      type: 'password',
      autocomplete: 'current-password',
    });

    const element = input.element();
    const field = element.querySelector('input');

    expect(field?.getAttribute('autocomplete')).toBe('current-password');
  });
});
