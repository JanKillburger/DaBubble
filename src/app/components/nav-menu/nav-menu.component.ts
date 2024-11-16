import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../dialog-components/create-channel/create-channel.component';
import { HomeService } from '../../services/home.service';
import { ContactButtonComponent } from '../contact-button/contact-button.component';
import { DataService } from '../../services/data.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChannelData, Chat } from '../../models/app.model';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgIf,
    ContactButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  dialog = inject(MatDialog);
  hs = inject(HomeService);
  ds = inject(DataService);
  
  messagesExpanded = true;
  channelsExpanded = true;

  searchInput = new FormControl('')
  search = toSignal(this.searchInput.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), map(s => s ? s.toLowerCase() : s)), { initialValue: '' })

  filteredChannels = computed(() => this.ds.userChannels().filter(
    ch => ch.channelName.toLowerCase().includes(this.search()!)
  ))

  filteredChats = computed(() => this.ds.userChats().filter(
    ch => ch.participants && ch.recipient.name.toLowerCase().includes(this.search()!))
  )

  toggleMessages() {
    this.messagesExpanded = !this.messagesExpanded;
  }

  toggleChannels() {
    this.channelsExpanded = !this.channelsExpanded;
  }

  openCreateChannelDialog() {
    this.dialog.open(CreateChannelComponent, {
      panelClass: 'default-container',
    });
  }

  openChannel(channel: ChannelData) {
    if (channel.id) {
      this.hs.setChannel(channel);
    }
  }

  openChat(chat: Chat) {
    this.hs.openChat(chat);
  }

  newMessage() {
    this.hs.mainContent.set("new-message");
  }

  filterChannels(query: string) {
    return this.ds.userChannels().filter(channel => channel.channelName.toLowerCase().includes(query.toLowerCase()));
  }
}
