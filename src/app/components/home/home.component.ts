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
import { FormsModule } from '@angular/forms';
import { NewMessageComponent } from '../new-message/new-message.component';
import { DirectMessagesComponent } from '../direct-messages/direct-messages.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { ChannelData, SearchData, UserData } from '../../models/app.model';
import { SearchService } from '../../search.service';
import { DataService } from '../../services/data.service';
import converters from '../../services/firestore-converters';

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
  filterdPrivateMessageData: SearchData[] = [];
  filterdChannelsData: ChannelData[] = [];
  filterdChannelMessageData: SearchData[] = [];

  constructor(
    public dialog: MatDialog,
    public viewport: ViewportService,
    public hs: HomeService,
    private authService: FirebaseAuthService,
    private searchService: SearchService,
    private ds: DataService
  ) { }

  user = this.authService.userProfile

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

  closeThread() {
    this.hs.closeThread();
  }

  toggleNav() {
    this.hs.toggleNav();
  }

  search() {
    this.filterdChannelsData = this.ds.userChannels().filter(channel => channel.channelName.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.filterdChannelMessageData = this.searchService.messages()!
      .filter(message =>
        message.path.includes('channels') &&
        message.message.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .map(message => ({
        channelId: message.path[1],
        channelName: this.ds.userChannels().find(channel => channel.id === message.path[1])!.channelName,
        messageId: message.id,
        message: message.message
      }));
    this.filterdUserData = this.searchService.users()!.filter(user => user.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.filterdPrivateMessageData = this.searchService.messages()!
      .filter(message =>
        message.path.includes('chats') &&
        message.message.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .map(message => ({
        channelId: message.id,
        channelName: this.ds.userChats().find(chat => chat.id === message.path[1])!.recipient.name!,
        messageId: message.id,
        message: message.message
      }));
  }

  async openUserChat(userId: string) {
    let chat = this.ds.userChats().find((chat) => chat.users.includes(userId));
    if (chat) {
      this.hs.selectedChat.set(chat);
    } else {
      let chatId = (await this.ds.saveDoc({
        kind: 'chat',
        path: ['chats'],
        converter: converters.chat,
        users: [this.authService.userProfile()!.id, userId],
        participants: {
          [this.authService.userProfile()!.id]: {
            id: this.authService.userProfile()!.id,
            name: this.authService.userProfile()!.name
          },
          [userId]: {
            id: userId,
            name: this.searchService.users()!.find(user => user.id === userId)!.name
          }
        }
      }))?.id;
      chat = this.ds.userChats().find(chat => chat.id == chatId);
    }
    this.searchTerm = '';
    this.hs.openChat(chat!);
  }

  openUserChannel(channelId: string) {
    let channel = this.ds.userChannels().find((channel) => channel.id!.includes(channelId))
    this.hs.setChannel(channel!);
    this.searchTerm = ''
  }

  openMessageInChannel(channelId: string, messageId: string) {
    this.openUserChannel(channelId);
    setTimeout(() => {
      this.scrollToElement(messageId);
    }, 500);
  }

  openMessageInChat(chatlId: string, messageId: string) {
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
}
