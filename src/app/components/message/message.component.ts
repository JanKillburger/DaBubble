import {
  NgIf,
  CommonModule,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileDialogComponent } from '../dialog-components/user-profile-dialog/user-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Emoji, Message, Reply, UserData } from '../../models/app.model';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { HomeService } from '../../services/home.service';
import { LinkifyPipe } from '../../services/linkify.pipe';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { SearchService } from '../../search.service';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    PickerModule,
    MatButtonModule,
    CommonModule,
    LinkifyPipe,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() message!: Reply | Message;
  @Input() showReplies = false;
  @Input() container: 'thread' | 'channel' = 'thread';
  @Output() openThreadEv = new EventEmitter<Message>();
  showEmojiPicker = false;
  emoji = '';
  currentUser = this.authService.userProfile
  user?: Observable<UserData | undefined>

  constructor(
    public dialog: MatDialog,
    public channelService: FirebaseChannelService,
    private homeService: HomeService,
    private authService: FirebaseAuthService,
    private searchService: SearchService,
    private ds: DataService
  ) { }

  ngOnInit() {
    this.user = this.ds.getUser(this.message.from)
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.addEmojiToFirebase(event.emoji.native);
  }

  addEmojiToFirebase(emoji: any) {
    if (this.message.kind == "message") this.ds.addReactionToMessage(emoji, this.message)
  }

  openThread() {
    if (this.message.kind === "message") {
      this.homeService.setThreadMessage(this.message!);
      this.channelService.currentThreadForMessage = this.message?.id;
    }
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
      if (this.homeService.mainContent() === "channel") {
        return this.channelService.replies.get(this.message?.id);
      } else {
        return this.channelService.userChatReplies.get(this.message.id);
      }
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

  addOrDeleteEmoji(emoji: any) {
    this.addEmojiToFirebase(emoji);
  }

  getReactionsPeople(emoji: Emoji): string[] {
    return emoji.userId.map(
      (id) => {
        return id === this.authService.loggedInUser() ?
          'Du' :
          this.searchService.users()!.find((user) => user.userId === id)?.name || ''
      }
    );
  }
}
