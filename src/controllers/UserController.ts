import {
  AuthAPI,
  UserAPI,
  type ChangePasswordData,
  type UpdateProfileData,
  type User,
  type SearchUserData,
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

  public async searchUsers(data: SearchUserData): Promise<User[]> {
    return this.userApi.searchUsers(data);
  }
}

export const userController = new UserController();
