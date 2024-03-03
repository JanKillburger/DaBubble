import { Injectable } from '@angular/core';
import { ChannelData, FirebaseChannelService, Message } from './firebase-channel.service';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MAX_INLINE_WIDTH, LARGE_WIDTH, MEDIUM_WIDTH, SMALL_WIDTH } from '../../global-constants';
import { FirebaseAuthService } from './firebase-auth.service';
import { UserData } from './firebase-user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDialogComponent } from '../components/dialog-components/user-profile-dialog/user-profile-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  selectedChannel: ChannelData | undefined;
  selectedMessage: Message | undefined;
  screenMode: "small" | "medium" | "large" = "large";
  navVisible = true;
  threadVisible = true;
  threadVisibleMq!: boolean;
  channelVisible!: boolean;
  private breakpointSubscription!: Subscription;

  constructor(
    private responsive: BreakpointObserver,
    private dialog: MatDialog) {
    this.breakpointSubscription = this.responsive.observe([
      SMALL_WIDTH,
      MEDIUM_WIDTH,
      LARGE_WIDTH
    ])
      .subscribe(() => {

        if (this.responsive.isMatched(SMALL_WIDTH)) {
          this.screenMode = "small";
          if (this.navVisible) {
            this.channelVisible = false;
            this.threadVisibleMq = false;
          }
        } else if (this.responsive.isMatched(MEDIUM_WIDTH)) {
          this.screenMode = "medium";
          if (this.navVisible) {
            this.channelVisible = true;
            this.threadVisibleMq = false;
          }
        } else if (this.responsive.isMatched(LARGE_WIDTH)) {
          this.screenMode = "large";
          this.threadVisibleMq = true;
          this.channelVisible = true;
        }
      });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.breakpointSubscription.unsubscribe();
  }

  toggleNav() {
    if (this.screenMode == "small") {
      this.channelVisible = false;
      this.threadVisibleMq = false;
    }
    this.navVisible = !this.navVisible;
  }

  closeThread() {
    if (this.screenMode != "large") {
      this.threadVisibleMq = false;
    }
    this.threadVisible = false;
    this.channelVisible = true;
  }

  openThread() {
    this.threadVisibleMq = true;
    this.threadVisible = true;
    if (this.screenMode != "large") {
      this.channelVisible = false;
    }
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.removeAttribute("style");
    }, 500);
  }

  openChannel() {
    if (this.screenMode === 'small') {
      this.navVisible = false;
    }
    this.channelVisible = true;
  }

  getScreenMode() {
    return this.screenMode;
  }

  isNavVisible() {
    return this.navVisible;
  }

  isThreadVisible() {
    return this.threadVisible;
  }

  hasThreadSpace() {
    return this.threadVisibleMq;
  }

  isChannelVisible() {
    return this.channelVisible;
  }

  setChannel(channel: ChannelData) {
    if (channel !== this.selectedChannel) this.closeThread();
    this.selectedChannel = channel;
    this.openChannel();
  }

  setThreadMessage(message: Message) {
    this.selectedMessage = message;
    this.openThread();
  }

  getActiveChannel() {
    return this.selectedChannel;
  }

  getThreadMessage() {
    return this.selectedMessage;
  }

  goToMenu() {
    this.channelVisible = false;
    this.threadVisible = false;
    this.navVisible = true;
  }

  openUserProfile(user: UserData) {
    this.dialog.open(UserProfileDialogComponent, { panelClass: 'default-container', data: user });
  }
}
