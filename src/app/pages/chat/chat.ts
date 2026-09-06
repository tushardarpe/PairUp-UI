import { Component, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConnectionService } from '../../../core/services/connection.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { SocketService } from '../../../core/services/socket.service';

interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  ts: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private connectionService = inject(ConnectionService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private readonly socketService = inject(SocketService);

  private socket: Socket | null = null;

  targetId = this.route.snapshot.paramMap.get('id') || '';
  targetName = signal('');
  messages = signal<Message[]>([]);
  newMessage = signal('');
  targetPhotoUrl = signal('');
  messageContainer = viewChild<ElementRef<HTMLElement>>('messageContainer');
  targetIsOnline = signal(false);
  targetLastSeen = signal<Date | null>(null);

  private readonly handleMessageReceived = (message: any) => {
    const currentUser = this.authService.currentUser();
    const fromMe = message.fromUserId === currentUser?._id;

    console.log(`Message received from ${message.firstName}:`, message.text);

    this.messages.update((messages) => [
      ...messages,
      {
        id: crypto.randomUUID(),
        fromMe,
        text: message.text,
        ts: message.ts,
      },
    ]);

    this.scrollToBottom();
  };

  private readonly handlePresenceChanged = (presence: {
    userId: string;
    isOnline: boolean;
    lastSeen: string | null;
  }) => {
    if (presence.userId !== this.targetId) {
      return;
    }

    this.targetIsOnline.set(presence.isOnline);

    this.targetLastSeen.set(presence.lastSeen ? new Date(presence.lastSeen) : null);
  };

  ngOnInit(): void {
    const current = this.authService.currentUser();

    if (current?._id) {
      this.initializeChat(current);
    } else {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.authService.currentUser.set(user);
          this.initializeChat(user);
        },
        error: () => {
          console.log('Unable to resolve logged-in user');
        },
      });
    }

    this.loadTargetUser();
  }

  ngOnDestroy(): void {
    // Remove this component's listener only.
    // Do NOT call socket.disconnect() here.
    this.socket?.off('messageReceived', this.handleMessageReceived);
    this.socket?.off('presenceChanged', this.handlePresenceChanged);
  }

  initializeChat(user: any): void {
    this.socket = this.socketService.getSocket();
    this.socket.on('presenceChanged', this.handlePresenceChanged);

    this.socket.on('messageReceived', this.handleMessageReceived);

    this.loadChatHistory(user._id);

    this.socket.emit('joinChat', {
      toUserId: this.targetId,
    });
  }

  loadTargetUser(): void {
    if (!this.targetId) {
      return;
    }

    this.connectionService.getConnections().subscribe({
      next: (users) => {
        const found = users.find((user) => user._id === this.targetId);

        if (found) {
          this.targetName.set(`${found.firstName} ${found.lastName}`.trim());
          this.targetPhotoUrl.set(found.photoUrl || '');
          this.targetIsOnline.set(found.isOnline ?? false);

          this.targetLastSeen.set(found.lastSeen ? new Date(found.lastSeen) : null);
        }
      },
      error: () => {
        console.log('Unable to load target user');
      },
    });
  }

  sendMessage(): void {
    const text = this.newMessage().trim();
    const currentUser = this.authService.currentUser();

    if (!text || !currentUser?._id || !this.targetId || !this.socket) {
      return;
    }

    this.socket.emit('sendMessage', {
      toUserId: this.targetId,
      text,
    });

    this.newMessage.set('');
  }

  back(): void {
    this.router.navigate(['/connections']);
  }

  loadChatHistory(userId: string): void {
    this.http
      .get<any>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.CHAT.GET_CHATS}/${this.targetId}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (chat) => {
          const messages: Message[] = chat.messages.map((message: any) => ({
            id: message._id,
            fromMe: message.senderId._id === userId,
            text: message.text,
            ts: new Date(message.createdAt).getTime(),
          }));

          this.messages.set(messages);
          setTimeout(() => this.scrollToBottom());
        },
        error: (err) => {
          console.error('Error loading chat history:', err);
        },
      });
  }

  formatLastSeen(lastSeen: Date | null): string {
    if (!lastSeen || Number.isNaN(lastSeen.getTime())) {
      return 'Offline';
    }

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const time = lastSeen.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (this.isSameDay(lastSeen, now)) {
      return `last seen today at ${time}`;
    }

    if (this.isSameDay(lastSeen, yesterday)) {
      return `last seen yesterday at ${time}`;
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
    };

    if (lastSeen.getFullYear() !== now.getFullYear()) {
      dateOptions.year = 'numeric';
    }

    const date = lastSeen.toLocaleDateString('en-GB', dateOptions);

    return `last seen ${date} at ${time}`;
  }

  private isSameDay(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messageContainer()?.nativeElement;

      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
