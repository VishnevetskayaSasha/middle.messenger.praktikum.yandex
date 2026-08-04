import {
  AuthAPI,
  UserAPI,
  type ChangePasswordData,
  type UpdateProfileData,
  type User,
} from '../api';

class UserController {
  private authApi = new AuthAPI();
  private userApi = new UserAPI();

  public async getUser(): Promise<User> {
    return this.authApi.getUser();
  }

  public async updateProfile(data: UpdateProfileData): Promise<User> {
    return this.userApi.updateProfile(data);
  }

  public async changePassword(data: ChangePasswordData): Promise<void> {
    await this.userApi.changePassword(data);
  }

  public async changeAvatar(data: FormData): Promise<User> {
    return this.userApi.changeAvatar(data);
  }
}

export const userController = new UserController();
