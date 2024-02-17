import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    'mobileReset-password.component.scss',
  ],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

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
    let auth = getAuth();
    let userControl = auth.currentUser;
    if (userControl && this.password) {
      let passwordValue = this.password.value;
      this.authService.updateNewPasswordWithEmail(userControl, passwordValue);
      this.router.navigate(['/']);
    } else {
      console.log('Error');
    }
  }
}
