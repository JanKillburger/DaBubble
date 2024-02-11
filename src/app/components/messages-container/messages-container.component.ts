import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-messages-container',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.scss'
})
export class MessagesContainerComponent {
  @Output() openThreadEv = new EventEmitter<string>;

  openThread(thread: string) {
    this.openThreadEv.emit('');
  }
}
