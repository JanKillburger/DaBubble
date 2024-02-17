import { Component } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { SelectAvatarComponent } from './select-avatar/select-avatar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterLink } from '@angular/router';
import { startAnimations } from '../../models/animations.class';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginDialogComponent,
    SignUpDialogComponent,
    SelectAvatarComponent,
    ForgotPasswordComponent,
    RouterLink,
    NgClass,
    CommonModule,
  ],
  animations: [
    startAnimations.landingPageAnimationDesktop,
    startAnimations.landingPageAnimationMobile,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './mobileLogin.component.scss'],
})
export class LoginComponent {
  landingPageAnimationDesktop: string = '';
  animationFinished: boolean = false;
  isMobileScreen: boolean = false;
  showLoginFooter: boolean = false;

  constructor() {
    setTimeout(() => {
      this.animationFinished = true;
    }, 3000);
  }

  createContact() {
    let contactButton = document.getElementById('create-contact-button');
    let SingUp = document.getElementById('create-contact-dialog');
    let loginDialog = document.getElementById('login-dialog');
    let SingUpFooter = document.getElementById('create-contact-footer');

    SingUp?.classList.remove('display_none');
    contactButton?.classList.add('display_none');
    loginDialog?.classList.add('display_none');
    SingUpFooter?.classList.add('display_none');
    this.toggleLoginFooter();
  }

  toggleLoginFooter() {
    this.showLoginFooter = !this.showLoginFooter;
  }
}
