import { ChatsAPI,
  type Chat,
  type CreateChatData,
  type ChatToken,
  type AddUsersToChatData,
  type RemoveUsersFromChatData,
  type DeleteChatData,
  type User } from '../api';

class ChatsController {
  private api = new ChatsAPI();

  public async getChats(): Promise<Chat[]> {
    return this.api.getChats();
  }

  public async createChat(data: CreateChatData): Promise<void> {
    return this.api.createChat(data);
  }

  public async getChatToken(chatId: number): Promise<ChatToken> {
    return this.api.getChatToken(chatId);
  }

  public async addUsers(data: AddUsersToChatData): Promise<void> {
    return this.api.addUsers(data);
  }

  public async getChatUsers(chatId: number): Promise<User[]> {
    return this.api.getChatUsers(chatId);
  }

  public async removeUsers(data: RemoveUsersFromChatData): Promise<void> {
    return this.api.removeUsers(data);
  }

  public async deleteChat(data: DeleteChatData): Promise<void> {
    return this.api.deleteChat(data);
  }
}

export const chatsController = new ChatsController();
