import {
  AuthAPI,
  type SignInData,
  type SignUpData,
  type User,
} from '../api';

class AuthController {
  private api = new AuthAPI();

  public async signIn(data: SignInData): Promise<void> {
    await this.api.signIn(data);
  }

  public async signUp(data: SignUpData): Promise<void> {
    await this.api.signUp(data);
  }

  public async getUser(): Promise<User> {
    return this.api.getUser();
  }

  public async logout(): Promise<void> {
    await this.api.logout();
  }
}

export const authController = new AuthController();
