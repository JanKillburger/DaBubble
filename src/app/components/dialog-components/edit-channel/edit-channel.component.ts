import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ChannelData, UserData } from '../../../models/app.model';
import { ChannelMembersListComponent } from '../../shared/channel-members-list/channel-members-list.component';
import { HomeService } from '../../../services/home.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';

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
    private authService: FirebaseAuthService,
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
    this.data[0].channelName = this.name;
    this.channelService.editChannel(this.data[0]);
    this.nameDisplayMode = 'view';
  }

  saveDesc() {
    this.data[0].channelDescription = this.desc;
    this.channelService.editChannel(this.data[0]);
    this.descDisplayMode = 'view';
  }

  leaveChannel() {
    this.data[0].users = this.data[0].users.filter(el => el !== this.authService.loggedInUser());
    this.channelService.editChannel(this.data[0]);
    const newChannel = this.channelService.userChannels.find(channel => this.homeService.selectedChannel()?.id !== channel.id);
    if (newChannel) this.homeService.setChannel(newChannel);
    this.dialogRef.close();
  }

  showMembers() {
    return this.homeService.screenMode() === "small";
  }
}
