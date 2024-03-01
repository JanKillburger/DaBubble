import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { informationAnimation } from '../../../models/userInformation.class';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [NgFor, ImgUploadComponent, CommonModule, RouterLink],
  templateUrl: './select-avatar.component.html',
  styleUrls: [
    './select-avatar.component.scss',
    './mobileSelect-avatar.component.scss',
  ],
  animations: [informationAnimation.userInformation]
})
export class SelectAvatarComponent {
  signUpData: any;
  userId: any;
  avatarSelectedImg: string = '';
  avatarSelected: boolean = false;
  Username: string = '';
  dataIsAlreadyLoaded: boolean = false;
  loginSuccessful: boolean = false;
  avatarImgs = [
    './assets/img/login/SingIn/avatar1.png',
    './assets/img/login/SingIn/avatar2.png',
    './assets/img/login/SingIn/avatar3.png',
    './assets/img/login/SingIn/avatar4.png',
    './assets/img/login/SingIn/avatar5.png',
    './assets/img/login/SingIn/avatar6.png',
  ];

  constructor(
    public userFirebaseService: FirebaseAuthService,
    public storage: FirebaseStorageService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.userId = this.activeRoute.snapshot.paramMap.get('id');
    this.getDataFromSingUp();
    this.subscribeToImageChanges();
  }

  subscribeToImageChanges() {
    this.storage.userImgUrl.subscribe((url) => {
      if (url === '') {
        this.avatarSelectedImg = './assets/img/login/SingIn/emptyProfile.png';
      } else {
        this.avatarSelectedImg = url;
        this.signUpData.avatar = this.avatarSelectedImg;
        this.avatarSelected = true;
      }
    });
  }

  async getDataFromSingUp() {
    this.signUpData = await this.userFirebaseService.getUserData(this.userId);
    this.Username = this.signUpData.name;
  }

  addImgDialog() {
    let updloadDialog = document.getElementById('updloadDialog');
    updloadDialog?.classList.remove('display_none');
  }

  backToSingIn() {
    this.router.navigate(['/']);
  }

  activateAvatar(index: number) {
    this.avatarSelectedImg = this.avatarImgs[index];
    this.signUpData.avatar = this.avatarSelectedImg;
    this.avatarSelected = true;
  }

  async saveUser() {
    if (this.avatarSelected) {
      this.loginSuccessful = await this.userFirebaseService.updateUserService(
        this.signUpData,
        this.userId
      );
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }
}
