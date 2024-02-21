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

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  constructor(public dialog: MatDialog, private channelService: FirebaseChannelService,) {}
  channel = '';
  nameExists = false;
  showCreateChannelDialog = false;

  channelsForm: FormGroup = new FormGroup({
    channelsName: new FormControl('', Validators.required),
    channelsDescription: new FormControl(''),
  });

  get channelsName() {
    return this.channelsForm.get('channelsName');
  }
  get channelsDescription() {
    return this.channelsForm.get('channelsDescription');
  }

  createChannel() {
    console.log('created Channel!');
  }
}
