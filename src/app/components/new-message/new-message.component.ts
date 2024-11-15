import { Component, inject } from '@angular/core';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { NgFor, NgIf } from '@angular/common';
import { ChannelData, UserData } from '../../models/app.model';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { SearchService } from '../../search.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [MessagesInputComponent, NgFor, NgIf, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  channelService = inject(FirebaseChannelService);
  authService = inject(FirebaseAuthService);
  homeService = inject(HomeService);
  searchService = inject(SearchService);
  ds = inject(DataService);
  channelSearchResults: ChannelData[] = [];
  userSearchResults: UserData[] = [];
  userId: string = ''
  query = '';
  recipient: Recipient | undefined;

  getSearchResults() {
    if (this.query.length === 1) {
      this.userSearchResults = [];
      this.channelSearchResults = [];
      return;
    }
    if (this.query.startsWith("#")) {
      this.userSearchResults = [];
      this.channelSearchResults = this.getFirstN(this.channelService.userChannels.filter(channel => channel.channelName.toLowerCase().includes(this.query.replace('#', '').toLowerCase())), 5);
    } else if (this.query.startsWith("@")) {
      this.channelSearchResults = [];
      this.userSearchResults = this.getFirstN(this.searchService.users()!.filter(user => user.name.toLowerCase().includes(this.query.replace('@', '').toLowerCase())), 5);
    } else {
      this.channelSearchResults = [];
      this.userSearchResults = this.getFirstN(this.searchService.users()!.filter(user => user.email.toLowerCase().includes(this.query.toLowerCase())), 5);
    }
  }

  selectUser(user: UserData) {
    this.query = "@" + user.name;
    this.recipient = {type: "user", target: user};
    this.userSearchResults = [];
    this.createChat(user.userId!)
  }

  selectChannel(channel: ChannelData) {
    this.query = "#" + channel.channelName;
    this.channelSearchResults = [];
    this.recipient = {type: "channel", target: channel};
    this.homeService.setChannel(channel)
  }

  getFirstN(arr: any[], n: number) {
    if (arr.length <= n) {
      return arr;
    } else {
      return arr.slice(0, n);
    }
  }  

  async createChat(userId:string) {    
    let currentChat = this.channelService.userChats.find((chat) => chat.users.includes(userId))
    if (currentChat) {
      this.homeService.selectedChat.set(currentChat)
    } else {
      let chatId = await this.authService.addDirectChat(userId);
      this.homeService.selectedChat.set(this.ds.getDirectChat(chatId))
    }
  }

}
interface Recipient {
    type: "email" | "channel" | "user";
    target: string | ChannelData | UserData;
}
