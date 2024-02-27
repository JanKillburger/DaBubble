import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { JsonPipe, KeyValuePipe, NgFor, NgStyle } from '@angular/common';
import { json } from 'stream/consumers';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { MessagesInputComponent } from '../messages-input/messages-input.component';

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
  @Output() openThreadEv = new EventEmitter<void>();
  teamMembers = [
    'assets/img/login/SingIn/avatar1.png',
    'assets/img/login/SingIn/avatar2.png',
    'assets/img/login/SingIn/avatar3.png',
  ];
  @Input() channel = {};
  selectedChannel = 'yVkv2vilL4lVvya74f9Z';;

  constructor(public channelService: FirebaseChannelService) {}

  openThread(ev: string) {
    this.openThreadEv.emit();
  }

  getChannel() {
    return this.channelService.userChannels[0];
  }

  getChannelMessages() {
    return this.channelService.userChannelsMessages.get(this.selectedChannel);
  }
}
