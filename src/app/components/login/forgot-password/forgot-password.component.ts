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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    './mobileForgot-password.component.scss',
  ],
  animations: [informationAnimation.userInformation]
})
export class ForgotPasswordComponent {
  constructor(public authService: FirebaseAuthService) {}
  sendMail: boolean = false
  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  backToLogIn() {
    let contactButton = document.getElementById('create-contact-button');
    let forgotPasswortDialog = document.getElementById(
      'forgot-passwort-dialog'
    );
    let loginDialog = document.getElementById('login-dialog');

    forgotPasswortDialog?.classList.add('display_none');
    contactButton?.classList.remove('display_none');
    loginDialog?.classList.remove('display_none');
  }

  async sendResetPasswortMail() {
    if (this.forgotPasswordForm.valid && this.email) {
      const emailValue = this.email.value;
      this.sendMail = await this.authService.forgotPasswordEmail(emailValue);
      setTimeout(() => {
        this.backToLogIn()
      }, 2000);
    }
  }
}
