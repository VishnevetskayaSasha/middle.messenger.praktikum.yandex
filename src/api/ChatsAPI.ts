import { BaseAPI } from './BaseAPI';
import type { User } from './AuthAPI';
import { API_URL } from './constants';

export interface LastMessage {
  user: {
    first_name: string;
    second_name: string;
    avatar: string | null;
    email: string;
    login: string;
    phone: string;
  };
  time: string;
  content: string;
}

export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: LastMessage | null;
}

export interface CreateChatData {
  title: string;
}

export interface ChatToken {
  token: string;
}

export interface AddUsersToChatData {
  users: number[];
  chatId: number;
}

export interface RemoveUsersFromChatData {
  users: number[];
  chatId: number;
}

export interface DeleteChatData {
  chatId: number;
}

export class ChatsAPI extends BaseAPI {
  public getChats(): Promise<Chat[]> {
    return this.http.get<Chat[]>(
      `${API_URL}/chats`,
      { cacheBust: true, }
    );
  }

  public createChat(data: CreateChatData): Promise<void> {
    return this.http.post<void>(
      `${API_URL}/chats`,
      { data },
    );
  }

  public getChatToken(chatId: number): Promise<ChatToken> {
    return this.http.post<ChatToken>(
      `${API_URL}/chats/token/${chatId}`,
    );
  }

  public addUsers(data: AddUsersToChatData): Promise<void> {
    return this.http.put<void>(
      `${API_URL}/chats/users`,
      { data },
    );
  }

  public getChatUsers(chatId: number): Promise<User[]> {
    return this.http.get<User[]>(
      `${API_URL}/chats/${chatId}/users`,
    );
  }

  public removeUsers(data: RemoveUsersFromChatData): Promise<void> {
    return this.http.delete<void>(
      `${API_URL}/chats/users`,
      { data },
    );
  }

  public deleteChat(data: DeleteChatData): Promise<void> {
    return this.http.delete<void>(
      `${API_URL}/chats`,
      { data },
    );
  }
}
