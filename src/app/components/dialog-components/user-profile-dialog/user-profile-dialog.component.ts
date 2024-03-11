import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseUserService, UserData } from '../../../services/firebase-user.service';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { HomeService } from '../../../services/home.service';

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss',
})
export class UserProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    private channelService: FirebaseChannelService,
    private homeService: HomeService,
    private userService: FirebaseUserService,
    @Inject(MAT_DIALOG_DATA) public user: UserData
  ) {}

  formMode: 'view' | 'edit' = 'view';
  userProfileForm = new FormGroup({
    name: new FormControl(this.user.name, Validators.required),
    email: new FormControl(this.user.email, [Validators.required, Validators.email]),
  });

  get name() {
    return this.userProfileForm.get('name');
  }

  get email() {
    return this.userProfileForm.get('email');
  }

  closeDialog() {
    this.dialogRef.close();
  }

  editUserProfile() {
    this.formMode = 'edit';
  }

  getCurrentUser() {
    return this.channelService.getCurrentUser();
  }

  saveUserProfileEdits() {
    this.user.name = this.userProfileForm.value.name!;
    this.user.email = this.userProfileForm.value.email!;
    this.userService.updateUserProfile(this.user);
  }

  async createChat() {
    const userId = this.user.id;
    let currentChat = this.channelService.userChats.find((chat) => chat.users.includes(userId!))
    if (currentChat) {
      this.homeService.openChat(currentChat)
      this.closeDialog()
    } else {
      let chatId = await this.channelService.addDirectChat(userId!);
      let currentChat = this.channelService.getDirectChat(chatId)
      this.homeService.openChat(currentChat!)
      this.closeDialog()
    }
  }
}
