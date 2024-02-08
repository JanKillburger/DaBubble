import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.scss',
})
export class SignUpDialogComponent {

  singInForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    privacy: new FormControl(false, Validators.required),
  });

  get name() {return this.singInForm.get("name")}
  get email() {return this.singInForm.get("email")}
  get password() {return this.singInForm.get("password")}
  get privacy() {return this.singInForm.get("privacy")}

  onSubmit() {
    this.goOnToSelectAvatar();
  }

  backToLogIn() {
    let contactButton = document.getElementById('create-contact-button');
    let SingIn = document.getElementById('create-contact-dialog');
    let loginDialog = document.getElementById('login-dialog');

    SingIn?.classList.add('display_none');
    contactButton?.classList.remove('display_none');
    loginDialog?.classList.remove('display_none');
  }

  goOnToSelectAvatar() {
    let avatarDialog = document.getElementById('select-avatar-dialog');
    let SingIn = document.getElementById('create-contact-dialog');
    SingIn?.classList.add('display_none');
    avatarDialog?.classList.remove('display_none');
  }
}
