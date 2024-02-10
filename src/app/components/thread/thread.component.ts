import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MessageComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Output() closeThreadEv = new EventEmitter<void>;

  closeThread() {
    this.closeThreadEv.emit();
  }
}
