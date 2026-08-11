import { Block, type BlockOwnProps } from '../../../framework';

import template from './modal.hbs?raw';
import './modal.scss';

interface ModalProps extends BlockOwnProps {
  title: string;
  content: Block;
  onClose?: () => void;
}

export class Modal extends Block<ModalProps> {
  protected template = template;

  private root: HTMLElement | null = null;

  public open(root: HTMLElement): void {
    if (this.root) {
      return;
    }

    this.root = root;
    root.append(this.element());
  }

  public close(): void {
    if (!this.root) {
      return;
    }

    const overlay = this.element().querySelector('.modal__overlay');
    const closeButton = this.refs.closeButton as HTMLButtonElement | undefined;

    overlay?.removeEventListener('click', this.handleClose);
    closeButton?.removeEventListener('click', this.handleClose);

    this.element().remove();
    this.root = null;
    this.props.onClose?.();
  }

  protected componentDidMount(): void {
    const body = this.element().querySelector('.modal__body');
    const overlay = this.element().querySelector('.modal__overlay');
    const closeButton = this.refs.closeButton as HTMLButtonElement | undefined;

    body?.append(this.props.content.element());
    overlay?.addEventListener('click', this.handleClose);
    closeButton?.addEventListener('click', this.handleClose);
  }

  private handleClose = (): void => {
    this.close();
  };
}
