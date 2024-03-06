import {
  DatePipe,
  JsonPipe,
  KeyValuePipe,
  NgClass,
  NgIf,
  CommonModule
} from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileDialogComponent } from '../dialog-components/user-profile-dialog/user-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { UserData } from '../../services/firebase-user.service';
import {
  FirebaseChannelService,
  Message,
} from '../../services/firebase-channel.service';
import { HomeService } from '../../services/home.service';
import { FirebaseMessageService } from '../../services/firebase-messages.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatIconModule,
    PickerModule,
    MatButtonModule,
    KeyValuePipe,
    JsonPipe,
    DatePipe,
    CommonModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() message?: Message;
  @Input() showReplies = false;
  @Input() container: 'thread' | 'channel' = 'thread';
  @Output() openThreadEv = new EventEmitter<Message>();
  showEmojiPicker = false;
  emoji = '';

  constructor(
    public dialog: MatDialog,
    public channelService: FirebaseChannelService,
    private homeService: HomeService,
    private messageService: FirebaseMessageService
  ) {}

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const { emoji } = this;
    const text = `${emoji}${event.emoji.native}`;
    this.addEmojiToFirebase(text)
  }

  addEmojiToFirebase(emoji:any){
    let messagePath = this.message?.id
    this.messageService.UpdateMessageWithEmojis(emoji, messagePath, this.message?.reactions)
  }

  openThread() {
    this.homeService.setThreadMessage(this.message!);
    this.channelService.currentThreadForMessage = this.message?.id;
  }

  showUserProfile() {
    const user = this.getUser();
    if (user) {
      this.dialog.open(UserProfileDialogComponent, { data: user });
    }
  }

  getUser(): UserData | undefined {
    return this.message?.from
      ? this.channelService.users.get(this.message.from)
      : undefined;
  }

  getFormattedDay(date: Date | undefined) {
    if (date) {
      const dateSection = new Date(date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
      const timeSection = new Date(date).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dateSection} ${timeSection}`;
    }
    return undefined;
  }

  getReplies(): Message[] | undefined {
    if (this.message?.id) {
      return this.channelService.replies.get(this.message?.id);
    } else {
      return undefined;
    }
  }

  getLastReplyDate() {
    const lastReply = this.getReplies()?.at(-1);
    return lastReply ? this.getFormattedDay(lastReply.created) : undefined;
  }

  hasReplies() {
    const replies = this.getReplies();
    if (replies !== undefined) {
      return replies.length > 0;
    } else {
      return false;
    }
  }

  getCurrentUser() {
    return this.channelService.getCurrentUser();
  }
}
