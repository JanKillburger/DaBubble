import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { PositionDetails } from '../../../models/position-details.model';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { NgIf } from '@angular/common';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';


@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public dialog: MatDialog,
    private channelService: FirebaseChannelService,
    @Inject(MAT_DIALOG_DATA) public positionDetails:  PositionDetails ) { }

  showUserProfile() {
    this.dialog.open(UserProfileDialogComponent, { panelClass: 'custom-container', position: this.positionDetails, data: this.channelService.getCurrentUser() });
    this.dialogRef.close();
  }

  onLogOut() {
    this.dialogRef.close();
  }
}
