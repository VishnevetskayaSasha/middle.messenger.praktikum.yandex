import { describe, expect, it, vi } from 'vitest';
import { Block } from '../../../framework';
import { Modal } from './modal';

class TestContent extends Block {
  protected template = '<div>Содержимое</div>';
}

describe('Modal', () => {
  it('должен добавлять модальное окно в переданный root при open', () => {
    const root = document.createElement('div');
    const modal = new Modal({
      title: 'Заголовок',
      content: new TestContent(),
    });

    modal.open(root);

    expect(root.querySelector('.modal')).not.toBeNull();
  });

  it('должен добавлять переданный content в тело модального окна', () => {
    const root = document.createElement('div');
    const modal = new Modal({
      title: 'Заголовок',
      content: new TestContent(),
    });

    modal.open(root);

    const body = root.querySelector('.modal__body');

    expect(body?.textContent).toContain('Содержимое');
  });

  it('должен удалять модальное окно из root при close', () => {
    const root = document.createElement('div');
    const modal = new Modal({
      title: 'Заголовок',
      content: new TestContent(),
    });

    modal.open(root);
    modal.close();

    expect(root.querySelector('.modal')).toBeNull();
  });

  it('должен вызывать onClose при закрытии модального окна', () => {
    const root = document.createElement('div');
    const onClose = vi.fn();
    const modal = new Modal({
      title: 'Заголовок',
      content: new TestContent(),
      onClose,
    });

    modal.open(root);
    modal.close();

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('должен закрываться при клике на overlay', () => {
    const root = document.createElement('div');
    const modal = new Modal({
      title: 'Заголовок',
      content: new TestContent(),
    });

    modal.open(root);

    const overlay = root.querySelector('.modal__overlay');

    overlay?.dispatchEvent(new MouseEvent('click'));

    expect(root.querySelector('.modal')).toBeNull();
  });
});
