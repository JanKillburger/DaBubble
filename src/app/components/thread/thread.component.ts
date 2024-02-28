import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { FirebaseChannelService, Message } from '../../services/firebase-channel.service';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MessageComponent, MessagesInputComponent, MessagesContainerComponent, NgFor],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Input() message: Message = {id: "frEnT8DXHxqDYEq2ZGD4", message: "Dies ist der Start eines Threads!", from: "x4CLz3LHfsVxLltxaFo1", created: new Date()};
  @Output() closeThreadEv = new EventEmitter<void>;

  constructor(private channelService: FirebaseChannelService) {}

  closeThread() {
    this.closeThreadEv.emit();
  }

  getReplies() {
    return this.channelService.replies.get(this.message.id);
  }
}
