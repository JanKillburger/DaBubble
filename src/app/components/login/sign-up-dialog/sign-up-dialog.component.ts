import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { User } from '../../../models/user.class';
import { SingInDataService } from '../../../services/singIn.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.scss',
})
export class SignUpDialogComponent {
  user = new User();
  userId: string = '';

  constructor(
    public authService: FirebaseAuthService,
    private dataService: SingInDataService,
    private router: Router
  ) {}

  singInForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    privacy: new FormControl(false, Validators.required),
  });

  get name() {
    return this.singInForm.get('name');
  }
  get email() {
    return this.singInForm.get('email');
  }
  get password() {
    return this.singInForm.get('password');
  }
  get privacy() {
    return this.singInForm.get('privacy');
  }

  async onSubmit() {
    this.userId = await this.authService.registerWithEmailAndPassword(
      this.user.email,
      this.user.password
    );
    if (this.userId != 'error') {
      this.goOnToSelectAvatar();
    } else {
      console.log('user already exists');
    }
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
    this.router.navigate(['/avatarPicker']);
    this.sendDataToSelectAvatar();
  }

  sendDataToSelectAvatar() {
    this.user.userId = this.userId;
    const signUpData = this.user;
    this.dataService.setData(signUpData);
  }
}
