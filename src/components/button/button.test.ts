import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('должен отображать переданные label и type', () => {
    const button = new Button({
      label: 'Отправить',
      type: 'submit',
    });

    const element = button.element();

    expect(element.textContent?.trim()).toBe('Отправить');
    expect(element.getAttribute('type')).toBe('submit');
  });

  it('должен добавлять modifier в класс кнопки', () => {
    const button = new Button({
      label: 'Отмена',
      type: 'button',
      modifier: 'secondary',
    });

    const element = button.element();

    expect(element.classList.contains('button_secondary')).toBe(true);
  });
});
