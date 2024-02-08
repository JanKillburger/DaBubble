import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
@Output() openThreadEv = new EventEmitter<void>();

openThread() {
  this.openThreadEv.emit();
}
}
