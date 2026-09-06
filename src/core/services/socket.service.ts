import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { createSocketConnection } from '../constants/socket';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      const socket = createSocketConnection();
      this.socket = socket;
      socket.on('connect', () => {
        console.log('🟢 Socket connected:', socket.id);
      });
    } else if (!this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  getSocket(): Socket {
    return this.connect();
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
