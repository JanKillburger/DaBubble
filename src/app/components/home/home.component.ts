import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../dialog-components/user-dialog/user-dialog.component';
import { ViewportService } from '../../services/viewport.service';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { ChannelComponent } from '../channel/channel.component';
import { ThreadComponent } from '../thread/thread.component';
import { MatIconModule } from '@angular/material/icon';
import { UsersToChannelComponent } from '../dialog-components/users-to-channel/users-to-channel.component';
import { HomeService } from '../../services/home.service';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { FormsModule } from '@angular/forms';
import { FirebaseMessageService } from '../../services/firebase-messages.service';
import { NewMessageComponent } from '../new-message/new-message.component';
import { DirectMessagesComponent } from '../direct-messages/direct-messages.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    NavMenuComponent,
    ChannelComponent,
    ThreadComponent,
    MatDialogModule,
    NgIf,
    NgClass,
    UsersToChannelComponent,
    MatButtonModule,
    FormsModule,
    NewMessageComponent,
    DirectMessagesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('dialogTrigger') dialogTrigger!: ElementRef;
  @ViewChild('triggerUserDialog') triggerUserDialog!: ElementRef;
  channels: any[] = [];
  searchTerm: string = '';

  constructor(
    public dialog: MatDialog,
    public viewport: ViewportService,
    private homeService: HomeService,
    private messageService: FirebaseMessageService,
    private channelService: FirebaseChannelService
  ) { }

  openDialog() {
    const positionDetails = this.viewport.getPositionRelativeTo(
      this.dialogTrigger,
      'top',
      'left'
    );
    this.dialog.open(UserDialogComponent, { position: positionDetails });
  }

  openUserDialog() {
    const positionDetails = this.viewport.getPositionRelativeTo(
      this.triggerUserDialog,
      'bottom',
      'right'
    );
    this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-container',
      position: positionDetails,
      data: positionDetails,
    });
  }

  getSelectedChannel() {
    return this.homeService.getActiveChannel();
  }

  getThreadMessage() {
    return this.homeService.getThreadMessage();
  }

  closeThread() {
    this.homeService.closeThread();
  }

  toggleNav() {
    this.homeService.toggleNav();
  }

  getScreenMode() {
    return this.homeService.getScreenMode();
  }

  isNavVisible() {
    return this.homeService.isNavVisible();
  }

  isThreadVisible() {
    return this.homeService.isThreadVisible();
  }

  hasThreadSpace() {
    return this.homeService.hasThreadSpace();
  }

  isChannelVisible() {
    return this.homeService.isChannelVisible();
  }

  goToMenu() {
    this.homeService.goToMenu();
  }

  getCurrentUser() {
    return this.channelService.getCurrentUser();
  }

  search() {
    this.messageService.searchingMessages(this.searchTerm);
  }

  clickBack() {
    this.messageService.goToNextMatch(-1);
  }

  clickNext() {
    this.messageService.goToNextMatch(+1);
  }

  getMainContent() {
    return this.homeService.mainContent;
  }
}
