import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { PositionDetails } from '../../../models/position-details.model';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { NgIf } from '@angular/common';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { HomeService } from '../../../services/home.service';


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
    private authService: FirebaseAuthService,
    private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) public positionDetails: PositionDetails) { }

  showUserProfile() {
    if (this.homeService.screenMode() === "small") {
      this.dialog.open(UserProfileDialogComponent, { panelClass: 'fullscreen-container', data: this.authService.userProfile()!.id });
    } else {
      this.dialog.open(UserProfileDialogComponent, { panelClass: 'custom-container', position: this.positionDetails, data: this.authService.userProfile()!.id });
    }
    this.dialogRef.close();
  }

  onLogOut() {
    this.authService.signOut();
    this.dialogRef.close();
  }
}
