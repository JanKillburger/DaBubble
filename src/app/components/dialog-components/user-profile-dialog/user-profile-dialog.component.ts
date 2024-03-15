import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseUserService, UserData } from '../../../services/firebase-user.service';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { HomeService } from '../../../services/home.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf, ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss',
})
export class UserProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    private channelService: FirebaseChannelService,
    private homeService: HomeService,
    private userService: FirebaseUserService,
    public storageService: FirebaseStorageService,
    @Inject(MAT_DIALOG_DATA) public user: UserData
  ) {}

  formMode: 'view' | 'edit' = 'view';
  userProfileForm = new FormGroup({
    name: new FormControl(this.user.name, Validators.required),
    email: new FormControl(this.user.email, [Validators.required, Validators.email]),
  });
  userAvatar = this.user.avatar;
  showAvatars = false;
  avatars = [
    'assets/img/login/SingIn/avatar1.png',
    'assets/img/login/SingIn/avatar2.png',
    'assets/img/login/SingIn/avatar3.png',
    'assets/img/login/SingIn/avatar4.png',
    'assets/img/login/SingIn/avatar5.png',
    'assets/img/login/SingIn/avatar6.png',
  ]

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
    this.user.avatar = this.userAvatar;
    this.userService.updateUserProfile(this.user);
    this.dialogRef.close();
  }

  async createChat() {
    const userId = this.user.id || this.user.authId || this.user.userId;
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

  setAvatar(index: number) {
    this.userAvatar = this.avatars[index];
  }
}
