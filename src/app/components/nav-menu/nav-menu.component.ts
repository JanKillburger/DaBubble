import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  messagesExpanded = true;
  channelsExpanded = true;

  toggleMessages() {
    this.messagesExpanded = !this.messagesExpanded;
  }

  toggleChannels() {
    this.channelsExpanded = !this.channelsExpanded;
  }

  openCreateChannelDialog() {
    console.log('Open the create-channel-dialog!');
  }
}
