import { Component, Inject, Input } from '@angular/core';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { UserData } from '../../../services/firebase-user.service';
import { NgFor } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PositionDetails } from '../../../models/position-details.model';
import { ChannelMembersListComponent } from '../../shared/channel-members-list/channel-members-list.component';

@Component({
  selector: 'app-channel-members',
  standalone: true,
  imports: [ContactButtonComponent, NgFor, MatIconModule, MatButtonModule, ChannelMembersListComponent],
  templateUrl: './channel-members.component.html',
  styleUrl: './channel-members.component.scss'
})
export class ChannelMembersComponent {

  constructor(
    public dialogRef: MatDialogRef<ChannelMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [UserData[], PositionDetails]
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
