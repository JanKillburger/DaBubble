import { Component } from '@angular/core';
import { AddChannelMemberComponent } from '../../shared/add-channel-member/add-channel-member.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel-member-dialog',
  standalone: true,
  imports: [AddChannelMemberComponent],
  templateUrl: './add-channel-member.component.html',
  styleUrl: './add-channel-member.component.scss'
})
export class AddChannelMemberDialog {

  constructor(public dialogRef: MatDialogRef<AddChannelMemberDialog>,) {

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
