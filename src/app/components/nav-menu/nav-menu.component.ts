import { Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../dialog-components/create-channel/create-channel.component';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { HomeService } from '../../services/home.service';
import { ContactButtonComponent } from '../contact-button/contact-button.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FirebaseMessageService } from '../../services/firebase-messages.service';
import { DataService } from '../../services/data.service';
import { FormControl, FormControlDirective, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChannelData, Chat, ChatUser } from '../../models/app.model';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgIf,
    NgFor,
    ContactButtonComponent,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  messagesExpanded = true;
  channelsExpanded = true;
  constructor(
    public dialog: MatDialog,
    public channelService: FirebaseChannelService,
    public hs: HomeService,
    private authService: FirebaseAuthService,
    private messageService: FirebaseMessageService,
    public ds: DataService
  ) { }

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
      this.messageService.getMessagesFromChannel(channel.id);
    }
  }

  openChat(chat: Chat) {
    this.hs.openChat(chat);
    this.messageService.getMessagesFromChannel(chat.id);
  }

  newMessage() {
    this.hs.mainContent.set("new-message");
  }

  getChats() {
    return this.channelService.userChats;
  }

  filterChannels(query: string) {
    return this.channelService.userChannels.filter(channel => channel.channelName.toLowerCase().includes(query.toLowerCase()));
  }
}
