import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
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
import {
  ChannelData,
  FirebaseChannelService,
  searchData,
} from '../../services/firebase-channel.service';
import { FormsModule } from '@angular/forms';
import { FirebaseMessageService } from '../../services/firebase-messages.service';
import { NewMessageComponent } from '../new-message/new-message.component';
import { DirectMessagesComponent } from '../direct-messages/direct-messages.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { UserData } from '../../services/firebase-user.service';

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
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('dialogTrigger') dialogTrigger!: ElementRef;
  @ViewChild('triggerUserDialog') triggerUserDialog!: ElementRef;
  channels: any[] = [];
  searchTerm: string = '';
  filterdUserData: UserData[] = [];
  filterdPrivateMessageData: searchData[] = [];
  filterdChannelsData: ChannelData[] = [];
  filterdChannelMessageData: searchData[] = [];

  constructor(
    public dialog: MatDialog,
    public viewport: ViewportService,
    private homeService: HomeService,
    private authService: FirebaseAuthService,
    private messageService: FirebaseMessageService,
    private channelService: FirebaseChannelService
  ) {}

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
    this.filterdChannelsData = this.messageService.searchingChannel(this.searchTerm);
    this.filterdChannelMessageData = this.messageService.searchingMessages(this.searchTerm);
    this.filterdUserData = this.authService.searchingUser(this.searchTerm);
    this.filterdPrivateMessageData = this.messageService.searchingPrivateMessages(this.searchTerm);
  }

  async openUserChat(userId:string){
    let currentChat = this.channelService.userChats.find((chat) => chat.users.includes(userId))
    if (currentChat) {
      this.homeService.selectedChat = currentChat
      this.searchTerm = ''
    } else {
      let chatId = await this.channelService.addDirectChat(userId);
      this.homeService.selectedChat = this.channelService.getDirectChat(chatId)
      this.searchTerm = ''
    }
    this.homeService.openChat(currentChat!);
    this.messageService.getMessagesFromChannel(userId);
  }

  openUserChannel(channelId:string){
    let currentChannel = this.channelService.userChannels.find((channel) => channel.id!.includes(channelId))
    this.homeService.setChannel(currentChannel!);
    this.messageService.getMessagesFromChannel(channelId);
    this.searchTerm = ''
  }

  openMessageInChannel(channelId:string, messageId:string){
    this.openUserChannel(channelId);
    setTimeout(() => {
      this.scrollToElement(messageId);
    }, 500);
  }

  openMessageInChat(chatlId:string, messageId:string){
    this.openUserChat(chatlId);
    setTimeout(() => {
      this.scrollToElement(messageId);
    }, 500);
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMainContent() {
    return this.homeService.mainContent;
  }
}
