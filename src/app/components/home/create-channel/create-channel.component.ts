import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {}
  channel = ""
  nameExists = false;
  showCreateChannelDialog = false;

  channelsForm = this.formBuilder.group({
    channelsName: ['', Validators.required],
    channelsDescription: [''],
  });

  createChannel(){
    console.log("created Channel!")
  }

  closeCreateChannelDialog(){
    this.showCreateChannelDialog = false
  }
}
