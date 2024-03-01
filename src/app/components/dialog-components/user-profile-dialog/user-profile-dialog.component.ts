import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserData } from '../../../services/firebase-user.service';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf, ReactiveFormsModule],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss'
})
export class UserProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    private channelService: FirebaseChannelService,
    @Inject(MAT_DIALOG_DATA) public user: UserData) { }

  formMode: 'view' | 'edit' = 'view';
  userProfileForm = new FormGroup({
    name: new FormControl(this.user.name),
    email: new FormControl(this.user.email)
  })

  closeDialog() {
    this.dialogRef.close();
  }

  editUserProfile() {
    this.formMode = 'edit';
  }

  getCurrentUser() {
    return this.channelService.getCurrentUser();
  }
}
