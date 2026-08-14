import { BaseAPI } from './BaseAPI';
import { API_URL } from './constants';
import type { User } from './AuthAPI';

export interface UpdateProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface SearchUserData {
  login: string;
}

export class UserAPI extends BaseAPI {
  public updateProfile(data: UpdateProfileData): Promise<User> {
    return this.http.put<User>(
      `${API_URL}/user/profile`,
      { data },
    );
  }

  public changePassword(data: ChangePasswordData): Promise<unknown> {
    return this.http.put(
      `${API_URL}/user/password`,
      { data },
    );
  }

  public changeAvatar(data: FormData): Promise<User> {
    return this.http.put<User>(
      `${API_URL}/user/profile/avatar`,
      { data },
    );
  }

  public searchUsers(data: SearchUserData): Promise<User[]> {
    return this.http.post<User[]>(
      `${API_URL}/user/search`,
      { data },
    );
  }
}
