import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageComponent } from '../message/message.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { JsonPipe, KeyValuePipe, NgFor, NgStyle } from '@angular/common';
import { json } from 'stream/consumers';
import { ChannelData, FirebaseChannelService, Message } from '../../services/firebase-channel.service';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { HomeService } from '../../services/home.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChannelComponent } from '../dialog-components/edit-channel/edit-channel.component';
import { ViewportService } from '../../services/viewport.service';
import { ChannelMembersComponent } from '../dialog-components/channel-members/channel-members.component';
import { AddChannelMemberComponent } from '../dialog-components/add-channel-member/add-channel-member.component';
import { UserData } from '../../services/firebase-user.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MessageComponent,
    MessagesContainerComponent,
    NgFor,
    NgStyle,
    JsonPipe,
    MessagesInputComponent
    , KeyValuePipe],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  @Output() openThreadEv = new EventEmitter<Message>();
  @ViewChild('callEditChannel') callEditChannel!: ElementRef;
  @ViewChild('callChannelMembers') callChannelMembers!: ElementRef;
  @ViewChild('addMember') addMember!: ElementRef;
  constructor(public channelService: FirebaseChannelService, private homeService: HomeService, private dialog: MatDialog, private viewport: ViewportService) { }

  openThread(message: Message) {
    this.openThreadEv.emit(message);
  }

  getChannelMessages() {
    const channelId = this.getChannel()?.id;
    if (channelId) {
      return this.channelService.userChannelsMessages.get(channelId);
    } else {
      return undefined;
    }
  }

  getChannelUserAvatars() {
    const users = this.getChannel()?.users;
    let avatars = [];
    if (users) {
      for (let user of users) {
        avatars.push(this.channelService.users.get(user)?.avatar)
        if (avatars.length === 3) break;
      }
    }
    return avatars;
  }


  getChannel() {
    return this.homeService.getActiveChannel();
  }

  editChannel() {
    this.dialog.open(EditChannelComponent, { panelClass: 'custom-container--top-left', position: this.viewport.getPositionRelativeTo(this.callEditChannel, "bottom", "left"), data: this.getChannel() })
  }

  openMembersListDialog() {
    this.dialog.open(ChannelMembersComponent, { panelClass: 'custom-container', data: this.getChannelUsers(), position: this.viewport.getPositionRelativeTo(this.callChannelMembers, 'bottom', 'right') })
  }

  addChannelMember() {
    this.dialog.open(AddChannelMemberComponent, { panelClass: 'custom-container', position: this.viewport.getPositionRelativeTo(this.addMember, 'bottom', 'right') });
  }

  getChannelUsers() {
    const userIds = this.getChannel()?.users;
    if (userIds) {
      const users: UserData[] = [];
      for (const userId of userIds) {
        const user = this.channelService.users.get(userId);
        if (user) users.push(user);
      }
      return users;
    }
    return undefined
  }
}
