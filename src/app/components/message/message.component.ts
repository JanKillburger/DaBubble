import {
  NgIf,
  CommonModule,
} from '@angular/common';
import {
  Component,
  Input,
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
  showEmojiPicker = false;
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
