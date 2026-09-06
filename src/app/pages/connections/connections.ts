import { Component, inject, signal } from '@angular/core';
import { ConnectionService } from '../../../core/services/connection.service';
import { User } from '../../../core/interfaces/user/user.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './connections.html',
  styleUrl: './connections.scss',
})
export class Connections {
  private connectionService = inject(ConnectionService);

  connections = signal<User[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  maleAvatar =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuCDrWP-PLzuYftXl2FY5XZaAVdxCrH0jMQdrpavDgKw&s=10';
  femaleAvatar =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDewEL4wHzbmC6rV-WDQgVUKwnZF9LxK9Ef5IqltzYQg&s=10';
  genericAvatar =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6zcpHQlriXgIzIACwcHwUH76apRf48s3qyJg48tS0A&s=10';

  ngOnInit(): void {
    this.loadConnections();
  }

  getFallbackAvatar(gender: string) {
    const normalized = gender?.toLowerCase();
    if (normalized === 'female') {
      return this.femaleAvatar;
    }
    return this.maleAvatar;
  }

  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    const gender = img.dataset['gender'] || '';
    img.src = this.getFallbackAvatar(gender);
  }

  loadConnections() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.connectionService.getConnections().subscribe({
      next: (users) => {
        this.connections.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Unable to load connections. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
