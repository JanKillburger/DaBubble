import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../dialog-components/create-channel/create-channel.component';
import {
  ChannelData,
  FirebaseChannelService,
  Message,
} from '../../services/firebase-channel.service';
import { HomeService } from '../../services/home.service';
import { ContactButtonComponent } from '../contact-button/contact-button.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FirebaseMessageService } from '../../services/firebase-messages.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgIf,
    NgFor,
    ContactButtonComponent,
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  messagesExpanded = true;
  channelsExpanded = true;

  constructor(
    public dialog: MatDialog,
    public channelService: FirebaseChannelService,
    private homeService: HomeService,
    private authService: FirebaseAuthService,
    private messageService: FirebaseMessageService
  ) {}

  toggleMessages() {
    this.messagesExpanded = !this.messagesExpanded;
  }

  toggleChannels() {
    this.channelsExpanded = !this.channelsExpanded;
  }

  openCreateChannelDialog() {
    this.dialog.open(CreateChannelComponent, {
      panelClass: 'default-container',
    });
  }

  openChannel(channel: ChannelData) {
    if (channel.id) {
      this.homeService.setChannel(channel);
      this.messageService.getMessagesFromChannel(channel.id);
    } 
  }

  getScreenMode() {
    return this.homeService.getScreenMode();
  }

  openChat() {
    alert('This is a chat');
  }
}
