import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { UsersToChannelComponent } from '../users-to-channel/users-to-channel.component';
import { Channel } from '../../../models/channel.class';

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
    private channelService: FirebaseChannelService
  ) {}
  channel = new Channel();
  nameExists = false;
  showCreateChannelDialog = false;
  channelId: string = '';

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
    let channelToModifyIndex = this.channelService.channels.findIndex(
      (channel) => channel.channelName === this.channelName?.value
    );
    if (channelToModifyIndex === -1) {
      this.nameExists = false;
      await this.addToChannel();
      this.openUseToChannelDialog();
    } else {
      this.nameExists = true;
    }
  }

  async addToChannel() {
    this.channel.channelName = this.channelName?.value;
    this.channel.channelDescription = this.channelDescription?.value;
    this.channelId = await this.channelService.addChannel(this.channel);
  }

  openUseToChannelDialog() {
    this.dialog.open(UsersToChannelComponent, {
      panelClass: 'default-container',
      data: this.channelId,
      maxWidth: '514px',
      width: '100%'
    });
  }
}
