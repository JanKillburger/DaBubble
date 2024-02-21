import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-users-to-channel',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './users-to-channel.component.html',
  styleUrl: './users-to-channel.component.scss',
})
export class UsersToChannelComponent {
  status: string = 'all';
  userToPick: boolean = false;
  constructor() {}

  migrateAllUser() {
    this.userToPick = false;
  }

  userInputField() {
    this.userToPick = true;
  }
}
