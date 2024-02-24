import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { FirebaseUserlService } from '../../../services/firebase-user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Channel } from '../../../models/channel.class';

@Component({
  selector: 'app-users-to-channel',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users-to-channel.component.html',
  styleUrl: './users-to-channel.component.scss',
})
export class UsersToChannelComponent {
  userPicker = new FormControl();
  status: string = 'all';
  userToPick: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public channelId: any,
    private channelService: FirebaseChannelService,
    public userService: FirebaseUserlService
  ) {
    this.userService.getUserData();
    this.channelService.getCurrentChannel(this.channelId);
  }

  async migrateAllUser() {
    this.userToPick = false;
  }

  userInputField() {
    this.userToPick = true;
  }

  appendUserIds(userList: any[]) {
    if (this.channelService.currentChannel && userList) {
      this.channelService.currentChannel.users = [];
      userList.forEach((user) => {
        this.channelService.currentChannel?.users.push(user.userId);
      });
    }
  }

  updateChannelWithUser(){
    if (this.userToPick) {
      this.appendUserIds(this.userPicker.value)
    } else {this.appendUserIds(this.userService.allUsers)}
    this.channelService.updateChannel(this.channelService.currentChannel , this.channelId)
  }
}
