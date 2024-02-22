import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { FirebaseUserlService } from '../../../services/firebase-user.service';

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public channelId: any,
    private channelService: FirebaseChannelService,
    private userService: FirebaseUserlService
  ) {this.userService.getUserData()}

  async migrateAllUser() {
    this.userToPick = false;
    console.log(this.channelId);
    console.log(this.userService.allUsers)
  }

  userInputField() {
    this.userToPick = true;
  }
}
