import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { UsersToChannelComponent } from '../users-to-channel/users-to-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateChannelComponent>,
    private channelService: FirebaseChannelService,
    private authService: FirebaseAuthService
  ) {}
  channel = new Channel();
  nameExists = false;
  showCreateChannelDialog = false;
  channelId: string = '';
  currentUser: any = '';

  channelsForm: FormGroup = new FormGroup({
    channelName: new FormControl('', Validators.required),
    channelDescription: new FormControl(''),
  });

  get channelName() {
    return this.channelsForm.get('channelName');
  }
  get channelDescription() {
    return this.channelsForm.get('channelDescription');
  }

  async createChannel() {
    let channelToModifyIndex = this.channelService.userChannels.findIndex(
      (channel) => channel.channelName === this.channelName?.value
    );
    if (channelToModifyIndex === -1) {
      this.nameExists = false;
      await this.addToChannel();
      this.openUseToChannelDialog();
      this.dialogRef.close(true);
    } else {
      this.nameExists = true;
    }
  }

  async addToChannel() {
    this.currentUser = this.authService.userProfile();
    this.channel.channelName = this.channelName?.value;
    this.channel.channelDescription = this.channelDescription?.value;
    this.channel.users.push(this.currentUser.authId);
    this.channelId = await this.channelService.addChannel(this.channel);
    this.channel.channelCreator = this.currentUser.name;
  }

  openUseToChannelDialog() {
    this.dialog.open(UsersToChannelComponent, {
      panelClass: 'default-container',
      data: this.channelId,
      maxWidth: '514px',
      width: '100%',
    });
  }
}
