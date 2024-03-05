import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserData } from '../../services/firebase-user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-selected-user-tag',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './selected-user-tag.component.html',
  styleUrl: './selected-user-tag.component.scss'
})
export class SelectedUserTagComponent {
  @Input() user!: UserData | null;
  @Output() userremove = new EventEmitter<void>();

  deselectUser() {
    this.userremove.emit();
  }

}
