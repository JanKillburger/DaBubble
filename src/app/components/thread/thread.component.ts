import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { ChannelData, FirebaseChannelService, Message } from '../../services/firebase-channel.service';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { NgFor, NgIf } from '@angular/common';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MessageComponent, MessagesInputComponent, MessagesContainerComponent, NgFor, NgIf],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

  @Output() closeThreadEv = new EventEmitter<void>;

  constructor(private channelService: FirebaseChannelService, private homeService: HomeService) { }

  closeThread() {
    this.closeThreadEv.emit();
  }

  getReplies() {
    const message = this.homeService.getThreadMessage();
    if (message?.id) {
      if (this.homeService.mainContent === "channel") {
      return this.channelService.replies.get(message.id);
    } else if (this.homeService.mainContent === "direct-message") {
      return this.channelService.userChatReplies.get(message.id);
    } else { return }
    } else {
      return undefined;
    }
  }

  getMessage() {
    return this.homeService.getThreadMessage();
  }

  getChannel() {
    return this.homeService.getActiveChannel();
  }

  isChannelMessage() {
    return this.homeService.mainContent === "channel"
  }

  getContext(){
    if (this.homeService.mainContent === 'direct-message') {
      return 'user'
    } else if (this.homeService.mainContent === 'channel'){
      return 'channel'
    } else{
      return
    }  
  }
}
