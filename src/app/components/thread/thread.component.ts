import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
@Output() closeThreadEv = new EventEmitter<void>;

closeThread() {
  this.closeThreadEv.emit();
}
}
