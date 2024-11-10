import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
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

  constructor(private channelService: FirebaseChannelService, public hs: HomeService) { }

  closeThread() {
    this.closeThreadEv.emit();
  }

  getReplies() {
    const message = this.hs.selectedMessage();
    if (message?.id) {
      if (this.hs.mainContent() === "channel") {
        return this.channelService.replies.get(message.id);
      } else if (this.hs.mainContent() === "direct-message") {
        return this.channelService.userChatReplies.get(message.id);
      } else { return }
    } else {
      return undefined;
    }
  }

  isChannelMessage() {
    return this.hs.mainContent() === "channel"
  }

  getContext() {
    if (this.hs.mainContent() === 'direct-message') {
      return 'user'
    } else if (this.hs.mainContent() === 'channel') {
      return 'channel'
    } else {
      return
    }
  }
}
