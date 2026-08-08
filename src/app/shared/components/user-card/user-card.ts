import { Component, input, output } from '@angular/core';

import { User } from '../../../../core/interfaces/user/user.interface';
import { DragDropModule, CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-card',

  imports: [CdkDrag],

  templateUrl: './user-card.html',

  styleUrl: './user-card.scss',
})
export class UserCard {

  previewMode = input(false);

  user = input.required<User>();

  interested = output<string>();

  ignored = output<string>();

  onDragEnded(event: CdkDragEnd) {
     if(this.previewMode()) {
      return;
    }
    const x = event.distance.x;

    // RIGHT SWIPE

    if (x > 150) {
      this.interested.emit(this.user()._id);
    }

    // LEFT SWIPE
    else if (x < -150) {
      this.ignored.emit(this.user()._id);
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23222" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23fff" font-size="40">No Image</text></svg>';
  }
}
