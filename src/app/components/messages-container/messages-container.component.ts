import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { FirebaseChannelService, Message } from '../../services/firebase-channel.service';
import { KeyValuePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-messages-container',
  standalone: true,
  imports: [MessageComponent, NgFor],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.scss'
})
export class MessagesContainerComponent {
  @Input() date = '';
  @Input() messages!: Message[];
  @Input() channelId!: string;
  @Output() openThreadEv = new EventEmitter<string>;

  constructor(private channelService: FirebaseChannelService) { }

  openThread(thread: string) {
    this.openThreadEv.emit('');
  }

  getMessages() {
    return this.channelService.userChannelsMessages.get(this.channelId);
  }
}
