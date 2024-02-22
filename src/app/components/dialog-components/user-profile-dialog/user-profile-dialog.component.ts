import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss'
})
export class UserProfileDialogComponent {
  constructor(public dialogRef: MatDialogRef<UserDialogComponent>) { }
  closeDialog() {
    this.dialogRef.close();
  }
}
