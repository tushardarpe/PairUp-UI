import { Component, inject, signal } from '@angular/core';

import { UserCard } from '../../shared/components/user-card/user-card';

import { FeedService } from '../../../core/services/feed.service';

import { User } from '../../../core/interfaces/user/user.interface';

@Component({
  selector: 'app-feed',

  imports: [UserCard],

  templateUrl: './feed.html',

  styleUrl: './feed.scss',
})
export class Feed {
  private feedService = inject(FeedService);

  users = signal<User[]>([]);

  swipeClass = signal('');

  // page = 1;

  limit = 10;

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed() {
    this.feedService.getFeed(this.limit).subscribe({
      next: (newUsers) => {
        this.users.update((existingUsers) => {
          const existingIds = new Set(existingUsers.map((user) => user._id));

          const filteredUsers = newUsers.filter((user) => !existingIds.has(user._id));

          return [...existingUsers, ...filteredUsers];
        });

        // this.page++;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  onInterested(userId: string) {
    this.swipeClass.set('swipe-right');

    this.handleSwipe('interested', userId);
  }

  onIgnored(userId: string) {
    this.swipeClass.set('swipe-left');

    this.handleSwipe('ignored', userId);
  }

  handleSwipe(status: string, userId: string) {
    setTimeout(() => {
      this.feedService.sendRequest(status, userId).subscribe({
        next: () => {
          this.users.update((users) => users.slice(1));

          this.swipeClass.set('');
          if (this.users().length === 1) {
            this.loadFeed();
          }
        },

        error: (err) => {
          console.log(err);

          this.swipeClass.set('');
        },
      });
    }, 300);
  }
}
