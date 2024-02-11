import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MessageComponent, MessagesContainerComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  @Output() openThreadEv = new EventEmitter<void>();

  openThread(ev: string) {
    this.openThreadEv.emit();
  }
}
