import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { informationAnimation } from '../../../models/userInformation.class';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrls: [
    './login-dialog.component.scss',
    './mobileLogin-dialog.component.scss',
  ],
  animations: [informationAnimation.userInformation]

})
export class LoginDialogComponent {
  loading: boolean = false;
  wrongUser: boolean = false;
  constructor(public authService: FirebaseAuthService) {}

  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get email() {
    return this.logInForm.get('email');
  }
  get password() {
    return this.logInForm.get('password');
  }

  async loginFunction() {
    if (this.email && this.password) {
      this.wrongUser = await this.authService.loginWithEmailAndPassword(
        this.email.value,
        this.password.value
      );

      if (this.wrongUser) {
        setTimeout(() => {
          this.wrongUser = false;
        }, 5000);
      }
    }
  }

  guestLogin() {
    let guestUser = 'guest@mail.com';
    let guestPassword = 'guestPasswort123!';
    this.authService.loginWithEmailAndPassword(guestUser, guestPassword);
  }

  forgotPasswort() {
    let contactButton = document.getElementById('create-contact-button');
    let forgotPasswortDialog = document.getElementById(
      'forgot-passwort-dialog'
    );
    let loginDialog = document.getElementById('login-dialog');

    forgotPasswortDialog?.classList.remove('display_none');
    contactButton?.classList.add('display_none');
    loginDialog?.classList.add('display_none');
  }
}
