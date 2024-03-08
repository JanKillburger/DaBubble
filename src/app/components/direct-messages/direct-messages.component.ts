import { Component, inject } from '@angular/core';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { KeyValuePipe, NgFor } from '@angular/common';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [MessagesContainerComponent, KeyValuePipe, NgFor],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss'
})
export class DirectMessagesComponent {
  channelService = inject(FirebaseChannelService);
  homeService = inject(HomeService);

  getMessages() {
    const chatId = this.homeService.selectedChat?.id;
    if (chatId) return this.channelService.userChatMessages.get(chatId);
    return;
  }
}
