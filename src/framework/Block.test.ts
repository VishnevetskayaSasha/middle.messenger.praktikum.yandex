import { describe, expect, it, vi } from 'vitest';
import { Block, type BlockOwnProps } from './Block';

interface TestBlockProps extends BlockOwnProps {
  text: string;
  onClick?: () => void;
}

class TestBlock extends Block<TestBlockProps> {
  protected template = '<div>{{text}}</div>';

  constructor(props: TestBlockProps) {
    super(props);

    if (props.onClick) {
      this.events = {
        click: props.onClick,
      };
    }
  }
}

class TestBlockWithRef extends Block<TestBlockProps> {
  protected template = '<div><span ref="text">{{text}}</span></div>';

  public getRef(name: string): Element | undefined {
    return this.refs[name];
  }
}

describe('Block', () => {
  it('должен создавать DOM-элемент из шаблона и props', () => {
    const block = new TestBlock({
      text: 'Привет',
    });

    const element = block.element();

    expect(element.tagName).toBe('DIV');
    expect(element.textContent).toBe('Привет');
  });

  it('должен обновлять DOM после изменения props', () => {
    const block = new TestBlock({
      text: 'Привет',
    });

    block.element();

    block.setProps({
      text: 'Пока',
    });

    expect(block.element().textContent).toBe('Пока');
  });

  it('должен вызывать обработчик события', () => {
    const onClick = vi.fn();
    const block = new TestBlock({
      text: 'Нажми',
      onClick,
    });

    const element = block.element();

    element.dispatchEvent(new MouseEvent('click'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('должен сохранять элементы с ref', () => {
    const block = new TestBlockWithRef({
      text: 'Привет',
    });

    block.element();

    const ref = block.getRef('text');

    expect(ref?.textContent).toBe('Привет');
    expect(ref?.hasAttribute('ref')).toBe(false);
  });
});
