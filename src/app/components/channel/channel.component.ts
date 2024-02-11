import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  @Output() openThreadEv = new EventEmitter<void>();

  openThread() {
    this.openThreadEv.emit();
  }
}
