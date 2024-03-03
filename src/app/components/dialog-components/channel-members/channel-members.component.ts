import { Component, Inject, Input } from '@angular/core';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { UserData } from '../../../services/firebase-user.service';
import { NgFor } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-members',
  standalone: true,
  imports: [ContactButtonComponent, NgFor],
  templateUrl: './channel-members.component.html',
  styleUrl: './channel-members.component.scss'
})
export class ChannelMembersComponent {

constructor(
  public dialogRef: MatDialogRef<ChannelMembersComponent>,
  @Inject(MAT_DIALOG_DATA) public users: UserData[]
) {}
}
