import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { SingInDataService } from '../../../services/singIn.service';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [NgFor, ImgUploadComponent],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent {
  signUpData: any;
  avatarImgs = [
    './assets/img/login/SingIn/avatar1.png',
    './assets/img/login/SingIn/avatar2.png',
    './assets/img/login/SingIn/avatar3.png',
    './assets/img/login/SingIn/avatar4.png',
    './assets/img/login/SingIn/avatar5.png',
    './assets/img/login/SingIn/avatar6.png',
  ];

  constructor(public dataService: SingInDataService) {}

  addImgDialog() {
    let updloadDialog = document.getElementById('updloadDialog');
    updloadDialog?.classList.remove('display_none');
  }

  backToSingIn() {
    let avatarDialog = document.getElementById('select-avatar-dialog');
    let SingIn = document.getElementById('create-contact-dialog');

    SingIn?.classList.remove('display_none');
    avatarDialog?.classList.add('display_none');
  }

  activateAvatar(index: number) {
    this.signUpData = this.dataService.getData();
    console.log(this.avatarImgs[index]);
    console.log(this.signUpData);
  }
}
