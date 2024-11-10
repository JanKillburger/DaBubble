import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { NgFor } from '@angular/common';
import { Message } from '../../models/app.model';

@Component({
  selector: 'app-messages-container',
  standalone: true,
  imports: [MessageComponent, NgFor],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.scss'
})
export class MessagesContainerComponent {
  @Input() date = '';
  @Input() messages!: Message[] | undefined;
  @Input() channelId!: string;
  @Output() openThreadEv = new EventEmitter<Message>;

  openThread(message: Message) {
    this.openThreadEv.emit(message);
  }
}