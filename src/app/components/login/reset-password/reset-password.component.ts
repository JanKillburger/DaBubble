import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { informationAnimation } from '../../../models/userInformation.class';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    'mobileReset-password.component.scss',
  ],
  animations: [informationAnimation.userInformation]
})
export class ResetPasswordComponent {
  auth = inject(Auth)
  resetPasswordForm: FormGroup;
  resetNotification: boolean = false;

  constructor(public authService: FirebaseAuthService, private router: Router) {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  checkPasswords() {
    const password = this.resetPasswordForm.get('password')?.value;
    const confirmPassword =
      this.resetPasswordForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.resetPasswordForm
        .get('confirmPassword')
        ?.setErrors({ passwordMismatch: true });
    } else {
      this.resetPasswordForm.get('confirmPassword')?.setErrors(null);
    }
  }

  resetPassword() {
    let urlParams = new URLSearchParams(window.location.search);
    let userControl = urlParams.get('oobCode');
    if (userControl && this.password) {
      let passwordValue = this.password.value;
      confirmPasswordReset(this.auth, userControl, passwordValue).then(() => {
        this.resetNotification = true;
      })
      .catch((error) => {
        console.error('Error resetting password', error);
      });
      setTimeout(() => {
        this.resetNotification = false;
        this.router.navigate(['/']);
      }, 5000);
    }
  }
}
