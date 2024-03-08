import { Component, inject } from '@angular/core';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { NgFor, NgIf } from '@angular/common';
import { UserData } from '../../services/firebase-user.service';
import { ChannelData, FirebaseChannelService } from '../../services/firebase-channel.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormsModule } from '@angular/forms';

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
  channelSearchResults: ChannelData[] = [];
  userSearchResults: UserData[] = [];
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
      this.userSearchResults = this.getFirstN(this.authService.allUsers.filter(user => user.name.toLowerCase().includes(this.query.replace('@', '').toLowerCase())), 5);
    } else {
      this.userSearchResults = [];
      this.channelSearchResults = [];
    }
  }

  selectUser(user: UserData) {
    this.query = "@" + user.name;
    this.recipient = {type: "user", target: user};
    this.userSearchResults = [];
  }

  selectChannel(channel: ChannelData) {
    this.query = "#" + channel.channelName;
    this.channelSearchResults = [];
    this.recipient = {type: "channel", target: channel};
  }

  getFirstN(arr: any[], n: number) {
    if (arr.length <= n) {
      return arr;
    } else {
      return arr.slice(0, n);
    }
  }

  
}
interface Recipient {
    type: "email" | "channel" | "user";
    target: string | ChannelData | UserData;
}
