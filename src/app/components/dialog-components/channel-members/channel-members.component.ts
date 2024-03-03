import { Component, Inject, Input } from '@angular/core';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { UserData } from '../../../services/firebase-user.service';
import { NgFor } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { HomeService } from '../../../services/home.service';
import { AddChannelMemberComponent } from '../add-channel-member/add-channel-member.component';
import { ViewportService } from '../../../services/viewport.service';
import { PositionDetails } from '../../../models/position-details.model';

@Component({
  selector: 'app-channel-members',
  standalone: true,
  imports: [ContactButtonComponent, NgFor, MatIconModule, MatButtonModule],
  templateUrl: './channel-members.component.html',
  styleUrl: './channel-members.component.scss'
})
export class ChannelMembersComponent {

  constructor(
    public dialogRef: MatDialogRef<ChannelMembersComponent>,
    private dialog: MatDialog,
    private homeService: HomeService,
    @Inject(MAT_DIALOG_DATA) public data: [UserData[], PositionDetails]
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }

  openUserProfile(user: UserData) {
    this.homeService.openUserProfile(user);
  }

  openAddMemberDialog() {
    this.dialog.open(AddChannelMemberComponent, { panelClass: 'custom-container', position: this.data[1] });
    this.closeDialog();
  }
}
