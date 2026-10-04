import type { Block } from './Block';
import { render } from './render';

type BlockClass = new () => Block;

export class Route {
  private pathname: string;
  private BlockClass: BlockClass;
  private query: string;
  private block: Block | null = null;

  constructor(
    pathname: string,
    BlockClass: BlockClass,
    query: string,
  ) {
    this.pathname = pathname;
    this.BlockClass = BlockClass;
    this.query = query;
  }

  public match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  public render(): void {
    if (!this.block) {
      this.block = new this.BlockClass();
    }

    render(this.query, this.block);
  }

  public leave(): void {
    this.block = null;
  }
}
