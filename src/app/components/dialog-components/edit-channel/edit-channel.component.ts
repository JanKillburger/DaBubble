import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ChannelData, UserData } from '../../../models/app.model';
import { ChannelMembersListComponent } from '../../shared/channel-members-list/channel-members-list.component';
import { HomeService } from '../../../services/home.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FormsModule, NgClass, NgIf, ChannelMembersListComponent],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  constructor(public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    private homeService: HomeService,
    private authService: FirebaseAuthService,
    private ds: DataService,
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
    if (this.homeService.selectedChannel()?.kind !== undefined) {
      this.ds.saveDoc({ ...this.homeService.selectedChannel()!, channelName: this.name })
    }
    this.nameDisplayMode = 'view';
  }

  saveDesc() {
    if (this.homeService.selectedChannel()?.kind !== undefined) {
      this.ds.saveDoc({ ...this.homeService.selectedChannel()!, channelDescription: this.desc });
    }
    this.descDisplayMode = 'view';
  }

  leaveChannel() {
    if (this.homeService.selectedChannel()?.id) {
      this.authService.removeUserFromChannel(this.authService.loggedInUser(), this.homeService.selectedChannel()!.id);
    }
    this.dialogRef.close();
  }

  showMembers() {
    return this.homeService.screenMode() === "small";
  }
}
