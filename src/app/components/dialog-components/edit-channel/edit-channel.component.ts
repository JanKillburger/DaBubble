import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChannelData, FirebaseChannelService } from '../../../services/firebase-channel.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UserData } from '../../../services/firebase-user.service';
import { ChannelMembersListComponent } from '../../shared/channel-members-list/channel-members-list.component';
import { HomeService } from '../../../services/home.service';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FormsModule, NgClass, NgIf, ChannelMembersListComponent],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  constructor(public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    private channelService: FirebaseChannelService,
    private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) public data: [ChannelData, UserData[]]) { }

  name = this.data[0].channelName;
  desc = this.data[0].channelDescription;
  nameDisplayMode: "view" | "edit" = "view";
  descDisplayMode: "view" | "edit" = "view";

  closeDialog() {
    this.dialogRef.close();
  }

  editName() {
    this.nameDisplayMode = "edit";
  }

  editDesc() {
    this.descDisplayMode = "edit";
  }

  saveName() {
    console.log('name saved');
    this.nameDisplayMode = 'view';
  }

  saveDesc() {
    console.log('desc saved');
    this.descDisplayMode = 'view';
  }

  leaveChannel() {
    console.log('You are out!')
  }

  showMembers() {
    return this.homeService.getScreenMode() === "small";
  }
}
