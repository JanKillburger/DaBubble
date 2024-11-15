import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseUserService } from '../../../services/firebase-user.service';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';
import { HomeService } from '../../../services/home.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { UserData } from '../../../models/app.model';
import { DataService } from '../../../services/data.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgIf, ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss',
})
export class UserProfileDialogComponent {

  user: UserData | null = null

  constructor(
    public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    private channelService: FirebaseChannelService,
    private authService: FirebaseAuthService,
    private homeService: HomeService,
    private userService: FirebaseUserService,
    private ds: DataService,
    public storageService: FirebaseStorageService,
    @Inject(MAT_DIALOG_DATA) private userId: string
  ) { }

  ngOnInit() {
    firstValueFrom(this.ds.getUser(this.userId)).then(
      user => {
        if (user) {
          this.user = user;
          this.userAvatar = this.user.avatar;
          this.userProfileForm.setValue({name: user.name, email: user.email});
        }
      }
    )
  }

  formMode: 'view' | 'edit' = 'view';
  userProfileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(/\S+@\S+\.(\S){2,4}/), Validators.email]),
  });
  customAvatar: null | File = null;
  userAvatar = '';
  showAvatars = false;
  wrongFileFormat = false;
  fileTooLarge = false;
  avatars = [
    'assets/img/login/signin/avatar1.png',
    'assets/img/login/signin/avatar2.png',
    'assets/img/login/signin/avatar3.png',
    'assets/img/login/signin/avatar4.png',
    'assets/img/login/signin/avatar5.png',
    'assets/img/login/signin/avatar6.png',
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

  currentUser = this.authService.userProfile

  saveEdits() {
    if (this.user && this.customAvatar) {
      this.storageService.saveUserAvatar(this.user.userId || this.user.id || this.user.authId, this.customAvatar!)
        .then(response => this.storageService.getImgLink(response.ref))
        .then(url => this.userAvatar = url)
        .then(() => this.saveUserProfileEdits())
    } else {
      this.saveUserProfileEdits()
    }
  }

  saveUserProfileEdits() {
    if (this.user) {
      this.authService.updateUserSettings({
        ...this.user,
        name: this.userProfileForm.value.name || '',
        email: this.userProfileForm.value.email || '',
        avatar: this.userAvatar
      });
      this.dialogRef.close();
    }
  }

  async createChat() {
    const userId = this.user?.id || this.user?.authId || this.user?.userId;
    let currentChat = this.channelService.userChats.find((chat) => chat.users.includes(userId!))
    if (currentChat) {
      this.homeService.openChat(currentChat)
      this.closeDialog()
    } else {
      let chatId = await this.authService.addDirectChat(userId!);
      let currentChat = this.ds.getDirectChat(chatId)
      this.homeService.openChat(currentChat!)
      this.closeDialog()
    }
  }

  setAvatar(index: number) {
    this.userAvatar = this.avatars[index];
  }

  validateImage(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files && files[0]) {
      const file = files[0];
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        this.wrongFileFormat = true;
      } else {
        this.wrongFileFormat = false;
      }
      if (file.size > 2e6) {
        this.fileTooLarge = true;
      } else {
        this.fileTooLarge = false;
      }
      if (!this.fileTooLarge && !this.wrongFileFormat) {
        this.customAvatar = file;
      }
    }
  }

  onCancel() {
    this.customAvatar = null;
    this.wrongFileFormat = false;
    this.fileTooLarge = false;
  }
}
