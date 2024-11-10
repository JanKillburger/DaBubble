import { Component, effect, inject } from '@angular/core';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { ContactButtonComponent } from '../contact-button/contact-button.component';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Observable } from 'rxjs';
import { MessagesByDay } from '../../models/app.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [MessagesContainerComponent, AsyncPipe, KeyValuePipe, NgFor, ContactButtonComponent, MessagesInputComponent, NgIf],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss'
})
export class DirectMessagesComponent {
  channelService = inject(FirebaseChannelService);
  hs = inject(HomeService);
  ds = inject(DataService);
  authService = inject(FirebaseAuthService)
  messages$!: Observable<MessagesByDay>

  constructor() {
    effect(() => this.messages$ = this.ds.getChatMessages(this.hs.selectedChat()!.id))
    
  }

  openUserProfile() {
    this.hs.openUserProfile(this.hs.selectedChat()!.recipient!.id);
  }
}
