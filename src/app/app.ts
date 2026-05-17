import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('pairUp-web');
  protected authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.authService.currentUser.set(user);
      },

      error: () => {
        console.log('No logged in user');
      },
    });
  }
}
