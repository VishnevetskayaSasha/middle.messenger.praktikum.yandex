import type { User } from '../api';

interface StoreState {
  user: User | null;
}

class Store {
  private state: StoreState = {
    user: null,
  };

  public getState(): StoreState {
    return this.state;
  }

  public setState(nextState: Partial<StoreState>): void {
    this.state = {
      ...this.state,
      ...nextState,
    };
  }
}

export const store = new Store();
