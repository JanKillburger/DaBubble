import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { SingInDataService } from '../../../services/singIn.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [NgFor, ImgUploadComponent, CommonModule, RouterLink],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent {
  signUpData: any;
  avatarSelectedImg: string = './assets/img/login/SingIn/emptyProfile.png';
  avatarSelected: boolean = false;
  Username: string = 'Max Mustermann';
  dataIsAlreadyLoaded: boolean = false;
  avatarImgs = [
    './assets/img/login/SingIn/avatar1.png',
    './assets/img/login/SingIn/avatar2.png',
    './assets/img/login/SingIn/avatar3.png',
    './assets/img/login/SingIn/avatar4.png',
    './assets/img/login/SingIn/avatar5.png',
    './assets/img/login/SingIn/avatar6.png',
  ];

  constructor(public dataService: SingInDataService, private router: Router) {
    if (!this.dataIsAlreadyLoaded) {
      this.signUpData = this.dataService.getData();
      this.Username = this.signUpData.name;
    }
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
}
