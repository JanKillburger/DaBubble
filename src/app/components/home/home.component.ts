import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../dialog-components/user-dialog/user-dialog.component';
import { ViewportService } from '../../services/viewport.service';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { ChannelComponent } from '../channel/channel.component';
import { ThreadComponent } from '../thread/thread.component';
import { MatIconModule } from '@angular/material/icon';
import { MAX_INLINE_WIDTH, LARGE_WIDTH, MEDIUM_WIDTH, SMALL_WIDTH } from '../../../global-constants';
import { UsersToChannelComponent } from '../dialog-components/users-to-channel/users-to-channel.component';
import { Subscription } from 'rxjs';
import { ChannelData, FirebaseChannelService, Message, messages } from '../../services/firebase-channel.service';
import { channel } from 'diagnostics_channel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NavMenuComponent, ChannelComponent, ThreadComponent, MatDialogModule, NgIf, NgClass, UsersToChannelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  screenMode: "small" | "medium" | "large" = "large";
  navVisible = true;
  threadVisible = true;
  threadVisibleMq!: boolean;
  channelVisible!: boolean;
  @ViewChild('dialogTrigger') dialogTrigger!: ElementRef;
  @ViewChild('triggerUserDialog') triggerUserDialog!: ElementRef;
  private breakpointSubscription!: Subscription;
  channels: any[] = [];
  selectedChannelId = "yVkv2vilL4lVvya74f9Z";
  selectedMessage: Message | undefined;

  constructor(
    public dialog: MatDialog,
    public viewport: ViewportService,
    private responsive: BreakpointObserver,
    private channelService: FirebaseChannelService) { }

  ngOnInit() {
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

  openThread(message?: Message) {
    if (message) this.selectedMessage = message;
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
    this.navVisible = false;
    this.channelVisible = true;
  }

  openDialog() {
    const positionDetails = this.viewport.getPositionRelativeTo(this.dialogTrigger, "top", "left");
    this.dialog.open(UserDialogComponent, { position: positionDetails });
  }

  openUserDialog() {
    const positionDetails = this.viewport.getPositionRelativeTo(this.triggerUserDialog, "bottom", "right");
    this.dialog.open(UserDialogComponent, { panelClass: 'custom-container', position: positionDetails, data: positionDetails });
  }

  getSelectedChannel() {
    return this.channelService.userChannels.find(channel => channel.id === this.selectedChannelId);
  }
}