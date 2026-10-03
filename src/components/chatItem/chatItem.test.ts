import { describe, expect, it, vi } from 'vitest';
import { ChatItem } from './chatItem';

describe('ChatItem', () => {
  it('должен отображать данные чата', () => {
    const chatItem = new ChatItem({
      id: 1,
      name: 'Рабочий чат',
      unreadCount: 3,
      lastMessage: {
        text: 'Привет',
        time: '12:30',
        isOwn: false,
      },
      isSelected: false,
      onClick: vi.fn(),
    });

    const element = chatItem.element();

    expect(element.getAttribute('data-id')).toBe('1');
    expect(element.querySelector('.chat-item__title')?.textContent?.trim()).toBe('Рабочий чат');
    expect(element.querySelector('.chat-item__message')?.textContent?.trim()).toBe('Привет');
    expect(element.querySelector('.chat-item__date')?.textContent?.trim()).toBe('12:30');
    expect(element.querySelector('.chat-item__unread-count')?.textContent?.trim()).toBe('3');
  });

  it('должен вызывать onClick с id чата при клике', () => {
    const onClick = vi.fn();

    const chatItem = new ChatItem({
      id: 42,
      name: 'Рабочий чат',
      unreadCount: 0,
      lastMessage: null,
      isSelected: false,
      onClick,
    });

    const element = chatItem.element();

    element.dispatchEvent(new MouseEvent('click'));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledWith(42);
  });

  it('должен добавлять класс selected для выбранного чата', () => {
    const chatItem = new ChatItem({
      id: 1,
      name: 'Рабочий чат',
      unreadCount: 0,
      lastMessage: null,
      isSelected: true,
      onClick: vi.fn(),
    });

    const element = chatItem.element();

    expect(element.classList.contains('chat-item_selected')).toBe(true);
  });

  it('должен отображать "Вы:" для собственного последнего сообщения', () => {
    const chatItem = new ChatItem({
      id: 1,
      name: 'Рабочий чат',
      unreadCount: 0,
      lastMessage: {
        text: 'Привет',
        time: '12:30',
        isOwn: true,
      },
      isSelected: false,
      onClick: vi.fn(),
    });

    const element = chatItem.element();

    expect(element.querySelector('.chat-item__message-user')?.textContent?.trim()).toBe('Вы:');
  });
});
