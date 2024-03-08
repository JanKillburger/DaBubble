import { Component, inject } from '@angular/core';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { NgFor } from '@angular/common';
import { UserData } from '../../services/firebase-user.service';
import { ChannelData, FirebaseChannelService } from '../../services/firebase-channel.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [MessagesInputComponent, NgFor],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  channelService = inject(FirebaseChannelService);
  authService = inject(FirebaseAuthService);
  channelSearchResults: ChannelData[] = [];
  userSearchResults: UserData[] = [];

  getSearchResults(query: string) {
    if (query.length === 1) {
      this.userSearchResults = [];
      this.channelSearchResults = [];
      return;
    }
    if (query.startsWith("#")) {
      this.userSearchResults = [];
      this.channelSearchResults = this.getFirstN(this.channelService.userChannels.filter(channel => channel.channelName.toLowerCase().includes(query.replace('#', '').toLowerCase())), 5);
    } else if (query.startsWith("@")) {
      this.channelSearchResults = [];
      this.userSearchResults = this.getFirstN(this.authService.allUsers.filter(user => user.name.toLowerCase().includes(query.replace('@', '').toLowerCase())), 5);
    } else {
      this.userSearchResults = [];
      this.channelSearchResults = [];
    }
  }

  getFirstN(arr: any[], n: number) {
    if (arr.length <= n) {
      return arr;
    } else {
      return arr.slice(0, n);
    }
  }
}
