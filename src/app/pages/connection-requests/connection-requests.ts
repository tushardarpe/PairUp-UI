import { Component, inject, signal } from '@angular/core';
import { ConnectionService, ConnectionRequest } from '../../../core/services/connection.service';

@Component({
  selector: 'app-connection-requests',
  standalone: true,
  templateUrl: './connection-requests.html',
  styleUrl: './connection-requests.scss',
})
export class ConnectionRequests {
  private connectionService = inject(ConnectionService);

  requests = signal<ConnectionRequest[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  activeRequestId = signal('');

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.connectionService.getReceivedRequests().subscribe({
      next: (requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Unable to load connection requests. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  respond(requestId: string, status: 'accepted' | 'rejected') {
    this.activeRequestId.set(requestId);

    this.connectionService.respondToRequest(requestId, status).subscribe({
      next: () => {
        this.requests.update((current) => current.filter((request) => request._id !== requestId));
        this.activeRequestId.set('');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Unable to process the request. Please try again.');
        this.activeRequestId.set('');
      },
    });
  }
}
