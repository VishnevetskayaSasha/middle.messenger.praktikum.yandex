import { BaseAPI } from './BaseAPI';
import { API_URL } from './constants';

export interface SignInData {
  login: string;
  password: string;
}

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignUpResponse {
  id: number;
}

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export class AuthAPI extends BaseAPI {
  public signUp(data: SignUpData): Promise<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${API_URL}/auth/signup`,
    { data },
    );
  }

  public signIn(data: SignInData): Promise<unknown> {
    return this.http.post(`${API_URL}/auth/signin`,
    { data },
    );
  }

  public getUser(): Promise<User> {
    return this.http.get<User>(`${API_URL}/auth/user`);
  }

  public logout(): Promise<unknown> {
    return this.http.post(`${API_URL}/auth/logout`);
  }
}
