import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { JsonPipe, KeyValuePipe, NgFor, NgStyle } from '@angular/common';
import { json } from 'stream/consumers';
import { ChannelData, FirebaseChannelService, Message } from '../../services/firebase-channel.service';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MessageComponent,
    MessagesContainerComponent,
    NgFor,
    NgStyle,
    JsonPipe,
    MessagesInputComponent
    , KeyValuePipe],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  @Output() openThreadEv = new EventEmitter<Message>();
  teamMembers = [
    'assets/img/login/SingIn/avatar1.png',
    'assets/img/login/SingIn/avatar2.png',
    'assets/img/login/SingIn/avatar3.png',
  ];

  constructor(public channelService: FirebaseChannelService, private homeService: HomeService) { }

  openThread(message: Message) {
    this.openThreadEv.emit(message);
  }

  getChannelMessages() {
    const channelId = this.getChannel()?.id;
    if (channelId) {
      return this.channelService.userChannelsMessages.get(channelId);
    } else {
      return undefined;
    }
  }

  getChannelUserAvatars() {
    const users = this.getChannel()?.users;
    let avatars = [];
    if (users) {
      for (let user of users) {
        avatars.push(this.channelService.users.get(user)?.avatar)
        if (avatars.length === 3) break;
      }
    }
    return avatars;
  }


  getChannel() {
    return this.homeService.getActiveChannel();
  }
}
