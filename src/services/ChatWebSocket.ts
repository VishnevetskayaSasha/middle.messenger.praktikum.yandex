import { WS_URL } from '../api/constants';

export interface ChatMessage {
  id: number;
  user_id: number;
  time: string;
  type: 'message';
  content: string;
}

interface WebSocketServiceMessage {
  type: 'pong';
}

export class ChatWebSocket {
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private onMessage: | ((messages: ChatMessage[], isHistory: boolean) => void) | null = null;

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

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

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

  public sendMessage(message: string): void {

  //   console.log(
  //   'sendMessage:',
  //   message,
  //   this.socket?.readyState,
  // );

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(
      JSON.stringify({
        content: message,
        type: 'message',
      }),
    );
  }

  private handleOpen = (): void => {
    //console.log('WebSocket connected');

    this.socket?.send(
      JSON.stringify({
        content: '0',
        type: 'get old',
      }),
    );

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      if ( this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: 'ping',
          }),
        );
      }
    }, 5000);
  };

  private handleMessage = (event: MessageEvent): void => {
    try {
      const data:
        | ChatMessage
        | ChatMessage[]
        | WebSocketServiceMessage = JSON.parse(event.data);

      if (Array.isArray(data)) {
        this.onMessage?.(data, true);
        return;
      }

      if (data.type === 'pong') {
        return;
      }

      if (data.type === 'message') {
        this.onMessage?.([data], false);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  private handleError = (event: Event): void => {
    console.error(
      'WebSocket error:',
      event,
    );
  };

  private handleClose = (event: CloseEvent): void => {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (event.wasClean) {
      console.log(
        `WebSocket connection closed: ${event.code} ${event.reason}`,
      );
    } else {
      console.error(
        `WebSocket connection interrupted: ${event.code} ${event.reason}`,
      );
    }
  };

  public setOnMessage( callback: (messages: ChatMessage[],  isHistory: boolean) => void): void {
    this.onMessage = callback;
  }
}

