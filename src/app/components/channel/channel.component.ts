import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MessageComponent, MessagesContainerComponent, NgFor, NgStyle],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  @Output() openThreadEv = new EventEmitter<void>();
  teamMembers = [
    'assets/img/login/SingIn/avatar1.png',
    'assets/img/login/SingIn/avatar2.png',
    'assets/img/login/SingIn/avatar3.png',
  ]

  openThread(ev: string) {
    this.openThreadEv.emit();
  }
}
