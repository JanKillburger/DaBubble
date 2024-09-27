import { Component, inject } from '@angular/core';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { ContactButtonComponent } from '../contact-button/contact-button.component';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [MessagesContainerComponent, KeyValuePipe, NgFor, ContactButtonComponent, MessagesInputComponent, NgIf],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss'
})
export class DirectMessagesComponent {
  channelService = inject(FirebaseChannelService);
  homeService = inject(HomeService);
  authService = inject(FirebaseAuthService)


  getMessages() {
    const chatId = this.homeService.selectedChat?.id;
    if (chatId) return this.channelService.userChatMessages.get(chatId);
    return;
  }

  getContact() {
    const chat = this.homeService.selectedChat;
    if (chat) {
      return this.homeService.getChatContact(chat) ?? this.authService.userProfile()!;
    } else { return }
  }


  openUserProfile() {
    this.homeService.openUserProfile(this.getContact()!);
  }

  
}
