import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HomeService } from '../../../services/home.service';
import { UserData } from '../../../models/app.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { NgFor, NgIf } from '@angular/common';
import { AddChannelMemberDialog } from '../../dialog-components/add-channel-member/add-channel-member.component';
import { PositionDetails } from '../../../models/position-details.model';

@Component({
  selector: 'app-channel-members-list',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, ContactButtonComponent, NgIf, NgFor],
  templateUrl: './channel-members-list.component.html',
  styleUrl: './channel-members-list.component.scss'
})
export class ChannelMembersListComponent {
  @Input() isInDialog!: boolean;
  @Input() dialogPositionAddMember!: PositionDetails
  @Input() users!: UserData[]
  @Output() closeDialogEv = new EventEmitter<void>;
  constructor(
    private homeService: HomeService,
    private dialog: MatDialog
  ) { }

  closeDialog() {
    this.closeDialogEv.emit();
  }

  openUserProfile(user: UserData) {
    this.homeService.openUserProfile(user.id);
    this.closeDialog();
  }

  openAddMemberDialog() {
    this.dialog.open(AddChannelMemberDialog, { panelClass: 'custom-container', position: this.dialogPositionAddMember });
  }
}
