import { WS_URL } from '../api/constants';

export class ChatWebSocket {
  private socket: WebSocket | null = null;

  public connect(
    userId: number,
    chatId: number,
    token: string,
  ): void {
    this.socket = new WebSocket(`${WS_URL}/${userId}/${chatId}/${token}`);

    this.socket.addEventListener('open', this.handleOpen);
    this.socket.addEventListener('message', this.handleMessage);
    this.socket.addEventListener('error', this.handleError);
    this.socket.addEventListener('close', this.handleClose);
  }

  public disconnect(): void {
    if (!this.socket) {
      return;
    }

    this.socket.removeEventListener('open', this.handleOpen);
    this.socket.removeEventListener('message', this.handleMessage);
    this.socket.removeEventListener('error', this.handleError);
    this.socket.removeEventListener('close', this.handleClose);

    this.socket.close();
    this.socket = null;
  }

  private handleOpen = (): void => {
    console.log('WebSocket connected');

    this.socket?.send(
      JSON.stringify({
        content: '0',
        type: 'get old',
      }),
    );
  };

  private handleMessage = (event: MessageEvent): void => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message:', data);
  };

  private handleError = (event: Event): void => {
    console.error(
      'WebSocket error:',
      event,
    );
  };

  private handleClose = (): void => {
    console.log('WebSocket closed');
  };
}

