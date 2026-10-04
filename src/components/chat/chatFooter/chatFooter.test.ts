import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerComponent } from '../../../framework';
import { Input } from '../../input';
import { Button } from '../../button';
import { ChatFooter } from './chatFooter';

beforeAll(() => {
  registerComponent(Input);
  registerComponent(Button);
});

describe('ChatFooter', () => {
  it('должен вызывать onSend с текстом сообщения при отправке формы', () => {
    const onSend = vi.fn();
    const chatFooter = new ChatFooter({
      onSend,
    });

    const element = chatFooter.element();
    const form = element.querySelector('form');
    const input = element.querySelector(
      'input[name="message"]',
    ) as HTMLInputElement;

    input.value = 'Привет';

    form?.dispatchEvent(
      new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onSend).toHaveBeenCalledOnce();
    expect(onSend).toHaveBeenCalledWith('Привет');
  });

  it('должен очищать поле сообщения после успешной отправки', () => {
    const chatFooter = new ChatFooter({
      onSend: vi.fn(),
    });

    const element = chatFooter.element();
    const form = element.querySelector('form');
    const input = element.querySelector(
      'input[name="message"]',
    ) as HTMLInputElement;

    input.value = 'Привет';

    form?.dispatchEvent(
      new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(input.value).toBe('');
  });
});
