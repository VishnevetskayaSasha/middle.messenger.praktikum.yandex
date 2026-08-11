import { ChatsAPI, type Chat, type CreateChatData, type ChatToken } from '../api';

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
}

export const chatsController = new ChatsController();
