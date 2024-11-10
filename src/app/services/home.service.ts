import { Injectable, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LARGE_WIDTH, MEDIUM_WIDTH, SMALL_WIDTH } from '../../global-constants';
import { FirebaseAuthService } from './firebase-auth.service';
import { ChannelData, Chat, Message } from '../models/app.model';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDialogComponent } from '../components/dialog-components/user-profile-dialog/user-profile-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  readonly selectedChannel: WritableSignal<ChannelData | null> = signal(null)
  readonly selectedMessage: WritableSignal<Message | null> = signal(null)
  readonly selectedChat: WritableSignal<Chat | null> = signal(null)
  readonly screenMode: WritableSignal<"small" | "medium" | "large"> = signal("large");
  readonly navVisible = signal(true);
  readonly threadVisible = signal(true);
  readonly channelVisible = signal(true);
  private breakpointSubscription!: Subscription;
  readonly mainContent: WritableSignal<"channel" | "new-message" | "direct-message"> = signal("channel");
  readonly activeMessageInput: WritableSignal<'channel' | 'chat' | 'thread'> = signal('channel')

  constructor(
    private responsive: BreakpointObserver,
    private authService: FirebaseAuthService,
    private dialog: MatDialog) {
    this.breakpointSubscription = this.responsive.observe([
      SMALL_WIDTH,
      MEDIUM_WIDTH,
      LARGE_WIDTH
    ])
      .subscribe(() => {

        if (this.responsive.isMatched(SMALL_WIDTH)) {
          this.screenMode.set("small");
          if (this.navVisible()) {
            this.channelVisible.set(false);
          }
        } else if (this.responsive.isMatched(MEDIUM_WIDTH)) {
          this.screenMode.set("medium");
          if (this.navVisible()) {
            this.channelVisible.set(true);
          }
        } else if (this.responsive.isMatched(LARGE_WIDTH)) {
          this.screenMode.set("large");
          this.channelVisible.set(true);
        }
      });
  }

  ngOnDestroy() {
    this.breakpointSubscription.unsubscribe();
  }

  toggleNav() {
    if (this.screenMode() == "small") {
      this.channelVisible.set(false);
    }
    this.navVisible.set(!this.navVisible());
  }

  closeThread() {
    this.threadVisible.set(false);
    this.channelVisible.set(true);
  }

  openThread() {
    this.threadVisible.set(true);
    if (this.screenMode() != "large") {
      this.channelVisible.set(false);
    }
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.removeAttribute("style");
    }, 500);
    this.activeMessageInput.set("thread");
  }

  openChannel() {
    if (this.screenMode() === 'small') {
      this.navVisible.set(false);
    }
    this.channelVisible.set(true);
    this.mainContent.set("channel");
    this.activeMessageInput.set("channel");
  }

  openChat(chat: Chat) {
    if (this.screenMode() === 'small') {
      this.navVisible.set(false);
    }
    this.channelVisible.set(true);
    this.mainContent.set("direct-message");
    this.selectedChat.set(chat);
    this.activeMessageInput.set("chat");
  }

  setChannel(channel: ChannelData) {
    if (channel !== this.selectedChannel()) this.closeThread();
    this.selectedChannel.set(channel);
    this.openChannel();
  }

  setThreadMessage(message: Message) {
    this.selectedMessage.set(message);
    this.openThread();
  }

  goToMenu() {
    this.channelVisible.set(false);
    this.threadVisible.set(false);
    this.navVisible.set(true);
  }

  openUserProfile(userId: string) {
    this.dialog.open(UserProfileDialogComponent, { panelClass: 'default-container', data: userId });
  }

  setChat(chat: Chat) {
    this.selectedChat.set(chat);
  }
}
