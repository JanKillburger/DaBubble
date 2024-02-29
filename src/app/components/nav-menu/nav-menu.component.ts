import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../dialog-components/create-channel/create-channel.component';
import { ChannelData, FirebaseChannelService, Message } from '../../services/firebase-channel.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf, NgFor],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  messagesExpanded = true;
  channelsExpanded = true;

  constructor(public dialog: MatDialog, public channelService: FirebaseChannelService, private homeService: HomeService){}

  toggleMessages() {
    this.messagesExpanded = !this.messagesExpanded;
  }

  toggleChannels() {
    this.channelsExpanded = !this.channelsExpanded;
  }

  openCreateChannelDialog() {
    this.dialog.open(CreateChannelComponent, { panelClass: 'default-container'});
  }

  openChannel(channel: ChannelData) {
    if (channel) this.homeService.setChannel(channel);
  }
}
