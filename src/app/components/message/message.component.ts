import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgClass, NgIf, MatIconModule, MatButtonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() isMyMessage!: boolean;
  @Input() showReplies = false;
}
