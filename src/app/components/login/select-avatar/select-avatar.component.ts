import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { informationAnimation } from '../../../models/userInformation.class';
import { DataService } from '../../../services/data.service';
import { filter, firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { UserData } from '../../../models/app.model';

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
  ds = inject(DataService);
  as = inject(FirebaseAuthService);
  signUpData!: UserData | undefined;
  userId: any;
  avatarSelectedImg: string = '';
  avatarSelected: boolean = false;
  Username: string = '';
  dataIsAlreadyLoaded: boolean = false;
  loginSuccessful: boolean = false;
  avatarImgs = [
    './assets/img/login/signin/avatar1.png',
    './assets/img/login/signin/avatar2.png',
    './assets/img/login/signin/avatar3.png',
    './assets/img/login/signin/avatar4.png',
    './assets/img/login/signin/avatar5.png',
    './assets/img/login/signin/avatar6.png',
  ];

  constructor(
    public userFirebaseService: FirebaseAuthService,
    public storage: FirebaseStorageService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.userId = this.activeRoute.snapshot.paramMap.get('id');
    this.getDataFromSignUp();
    this.subscribeToImageChanges();
  }

  subscribeToImageChanges() {
    this.storage.userImgUrl.subscribe((url) => {
      if (url === '') {
        this.avatarSelectedImg = './assets/img/login/signin/emptyProfile.png';
      } else {
        this.avatarSelectedImg = url;
        this.signUpData!.avatar = this.avatarSelectedImg;
        this.avatarSelected = true;
      }
    });
  }

  async getDataFromSignUp() {
    this.signUpData = await firstValueFrom(this.ds.getUser(this.userId).pipe(filter(doc => doc !== undefined)));
    this.Username = this.signUpData!.name;
  }

  addImgDialog() {
    let updloadDialog = document.getElementById('updloadDialog');
    updloadDialog?.classList.remove('display_none');
  }

  backToSignIn() {
    this.router.navigate(['/']);
  }

  activateAvatar(index: number) {
    this.avatarSelectedImg = this.avatarImgs[index];
    this.signUpData!.avatar = this.avatarSelectedImg;
    this.avatarSelected = true;
  }

  async saveUser() {
    if (this.avatarSelected) {
      await this.as.updateUserSettings(
        this.signUpData!
      ).then(() => this.router.navigate(['/']));
    }
  }
}
