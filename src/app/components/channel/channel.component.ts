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
  @Input() channel!: ChannelData | undefined;
  selectedChannel = 'yVkv2vilL4lVvya74f9Z';

  constructor(public channelService: FirebaseChannelService, private homeService: HomeService) {}

  openThread(message: Message) {
    this.openThreadEv.emit(message);
  }

  getChannelMessages() {
    if (this.channel?.id) {
      return this.channelService.userChannelsMessages.get(this.channel.id);
    } else {
      return undefined;
    }
  }

  getChannel() {
    return this.homeService.getActiveChannel();
  }
}
