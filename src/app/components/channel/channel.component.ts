import { Component, effect, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { AsyncPipe, KeyValuePipe, NgStyle } from '@angular/common';
import { MessagesInputComponent } from '../messages-input/messages-input.component';
import { HomeService } from '../../services/home.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChannelComponent } from '../dialog-components/edit-channel/edit-channel.component';
import { ViewportService } from '../../services/viewport.service';
import { ChannelMembersComponent } from '../dialog-components/channel-members/channel-members.component';
import { AddChannelMemberDialog } from '../dialog-components/add-channel-member/add-channel-member.component';
import { Message, MessagesByDay } from '../../models/app.model';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MessagesContainerComponent,
    NgStyle,
    AsyncPipe,
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
  messagesByDay$!: Observable<MessagesByDay>

  constructor(
    public hs: HomeService,
    private dialog: MatDialog,
    private viewport: ViewportService,
    private ds: DataService
  ) {
    effect(() => {
      if (this.hs.selectedChannel()) {
        this.messagesByDay$ = this.ds.getChannelMessages(this.hs.selectedChannel()!.id)
      }
    })
  }

  openThread(message: Message) {
    this.openThreadEv.emit(message);
    
  }

  editChannel() {
    switch (this.hs.screenMode()) {
      case "small":
        this.dialog.open(EditChannelComponent, {
          panelClass: 'fullscreen-container',
          data: [this.hs.selectedChannel(), this.ds.getChannelUsers(this.hs.selectedChannel()!.id)]
        })
        break;
      case "medium":
        this.dialog.open(EditChannelComponent, {
          panelClass: 'default-container',
          data: [this.hs.selectedChannel(), this.ds.getChannelUsers(this.hs.selectedChannel()!.id)]
        })
        break;
      case "large":
        this.dialog.open(EditChannelComponent, {
          panelClass: 'custom-container--top-left',
          position: this.viewport.getPositionRelativeTo(this.callEditChannel, "bottom", "left"),
          data: [this.hs.selectedChannel(), this.ds.getChannelUsers(this.hs.selectedChannel()!.id)]
        })
        break;
    }
  }

  openMembersListDialog() {
    this.dialog.open(ChannelMembersComponent, {
      panelClass: 'custom-container',
      data: [this.ds.getChannelUsers(this.hs.selectedChannel()!.id), this.viewport.getPositionRelativeTo(this.addMember, 'bottom', 'right')],
      position: this.viewport.getPositionRelativeTo(this.callChannelMembers, 'bottom', 'right')
    })
  }

  addChannelMember() {
    if (this.hs.screenMode() === "small") {
      this.dialog.open(AddChannelMemberDialog, {
        panelClass: 'fullscreen-container'
      });
    } else {
      this.dialog.open(AddChannelMemberDialog, {
        panelClass: 'custom-container',
        position: this.viewport.getPositionRelativeTo(this.addMember, 'bottom', 'right')
      });
    }
  }
}
