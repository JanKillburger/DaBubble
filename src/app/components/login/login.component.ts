import {
  AfterViewInit,
  Component,
  HostBinding,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { SelectAvatarComponent } from './select-avatar/select-avatar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterLink } from '@angular/router';
import { startAnimations } from '../../models/animations.class';
import { NgClass, ViewportScroller, isPlatformBrowser } from '@angular/common';

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
  ],
  animations: [
    startAnimations.landingPageAnimationDesktop,
    startAnimations.landingPageAnimationMobile,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './mobileLogin.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  @HostBinding('@landingPageAnimationMobile')
  landingPageAnimationMobile: string = '';
  @HostBinding('@landingPageAnimationDesktop')
  landingPageAnimationDesktop: string = '';
  animationFinished: boolean = false;
  isMobileScreen: boolean = false;
  constructor(
    private viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', () => {
        this.checkScreenSize();
      });
    }

    setTimeout(() => {
      this.animationFinished = true;
    }, 2000);
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileScreen = window.innerWidth <= 768;
    }
  }

  createContact() {
    let contactButton = document.getElementById('create-contact-button');
    let SingIn = document.getElementById('create-contact-dialog');
    let loginDialog = document.getElementById('login-dialog');

    SingIn?.classList.remove('display_none');
    contactButton?.classList.add('display_none');
    loginDialog?.classList.add('display_none');
  }
}
