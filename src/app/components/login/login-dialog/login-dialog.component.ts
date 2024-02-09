import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user.class';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  // rightUser: boolean;
  // rightPassword: boolean;
  loading: boolean = false;
  user = new User();

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

  loginFunction() {
    this.authService.loginWithEmailAndPassword(
      this.user.email,
      this.user.password
    );
  }

  guestLogin() {}

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

  // async updateOnlineStatus() {
  //   this.authService.user.onlineStatus = true;

  //   await this.authService.newUser(
  //     this.authService.user.toJson(),
  //     this.authService.user.userId
  //   );
  // }
}
