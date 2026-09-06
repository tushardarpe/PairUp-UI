import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { AuthService } from '../core/services/auth.service';
import { SocketService } from '../core/services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('pairUp-web');
  protected authService = inject(AuthService);

  private readonly socketService = inject(SocketService);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();

      if (user) {
        this.socketService.connect();
      } else {
        this.socketService.disconnect();
      }
    });
  }
}
