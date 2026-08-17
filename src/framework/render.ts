import type { Block } from './Block';

export function render(query: string, block: Block): void {
  const root = document.querySelector(query);

  if (!root) {
    throw new Error(`Root element "${query}" not found`);
  }

  const element = block.element();
  root.replaceChildren(element);
}
