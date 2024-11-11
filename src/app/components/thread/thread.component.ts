import { Component, effect, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
import { Reply } from '../../models/app.model';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MessageComponent, MessagesInputComponent, NgFor, NgIf],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Output() closeThreadEv = new EventEmitter<void>;
  replies$!: Observable<Reply[]>

  constructor(private channelService: FirebaseChannelService, public hs: HomeService, private ds: DataService) { 
    effect(() => {
      if (this.hs.selectedMessage()) {
        this.replies$ = this.ds.getMessageReplies(this.hs.selectedMessage()!)
      }
    })
  }

  closeThread() {
    this.closeThreadEv.emit();
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
