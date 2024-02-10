import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
@Input() isMyMessage!: boolean;
}
