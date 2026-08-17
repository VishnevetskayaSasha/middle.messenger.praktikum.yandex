import { AuthAPI, type SignInData, type SignUpData, type User} from '../api';

class AuthController {
  private api = new AuthAPI();

  public async signIn(data: SignInData): Promise<User> {
    await this.api.signIn(data);
    return this.api.getUser();
  }

  public async signUp(data: SignUpData): Promise<User> {
    await this.api.signUp(data);
    return this.api.getUser();
  }

  public async logout(): Promise<void> {
    await this.api.logout();
  }
}

export const authController = new AuthController();
