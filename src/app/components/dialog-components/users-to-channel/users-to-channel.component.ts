import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HomeService } from '../../../services/home.service';
import { SearchService } from '../../../search.service';
import { DataService } from '../../../services/data.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UserData } from '../../../models/app.model';

@Component({
  selector: 'app-users-to-channel',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users-to-channel.component.html',
  styleUrl: './users-to-channel.component.scss',
})
export class UsersToChannelComponent {
  userPicker = new FormControl();
  status: string = 'all';

  constructor(
    @Inject(MAT_DIALOG_DATA) public channelId: any,
    private channelService: FirebaseChannelService,
    private homeService: HomeService,
    public searchService: SearchService,
    private as: FirebaseAuthService
  ) { }

  updateChannelWithUser(){
    
    if (this.userPicker.value?.length > 0) {
      var usersToAdd = this.userPicker.value as UserData[];
    } else {
      var usersToAdd = this.searchService.users()! as UserData[]
    }
    this.as.addUsersToChannel(usersToAdd , this.channelId);
    this.homeService.setChannel(this.channelService.currentChannel!);
    this.homeService.openChannel();
  }
}
