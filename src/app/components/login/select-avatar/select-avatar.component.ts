import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ImgUploadComponent } from './img-upload/img-upload.component';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [NgFor, ImgUploadComponent],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  avatarImgs = [
    "./assets/img/login/SingIn/avatar1.png",
    "./assets/img/login/SingIn/avatar2.png",
    "./assets/img/login/SingIn/avatar3.png",
    "./assets/img/login/SingIn/avatar4.png",
    "./assets/img/login/SingIn/avatar5.png",
    "./assets/img/login/SingIn/avatar6.png",
  ]

  addImgDialog(){
    let updloadDialog = document.getElementById('updloadDialog')
    updloadDialog?.classList.remove('display_none')
  }
}
