import { DatePipe, JsonPipe, KeyValuePipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileDialogComponent } from '../dialog-components/user-profile-dialog/user-profile-dialog.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserData } from '../../services/firebase-user.service';
import { Message } from '../../services/firebase-channel.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgClass, NgIf, MatIconModule, MatButtonModule, KeyValuePipe, JsonPipe, DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message!: Message;
  @Input() isMyMessage!: boolean;
  @Input() showReplies = false;
  @Output() openThreadEv = new EventEmitter<string>;

  constructor(
    public dialog: MatDialog
  ) { }

  openThread(ev: Event) {
    this.openThreadEv.emit('');
  }

  showUserProfile() {
    this.dialog.open(UserProfileDialogComponent, { data: { name: "Noah Braun", email: "nbraun@email.de" } });
  }
}
