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
    public userFirebaseService: FirebaseAuthService,
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

  get name() {return this.singInForm.get('name');}
  get email() {return this.singInForm.get('email');}
  get password() {return this.singInForm.get('password');}
  get privacy() {return this.singInForm.get('privacy');}

  async onSubmit() {
    this.createUser()
    this.userId = await this.userFirebaseService.registerWithEmailAndPassword(
      this.user.email,
      this.user.password
    );
    if (this.userId != 'error') {
      this.goOnToSelectAvatar();
    } else {
      console.log('user already exists');
    }
  }

  createUser(){
    if (this.name && this.email && this.password) {
      this.user.name = this.name.value;
      this.user.email = this.email.value;
      this.user.password = this.password.value; 
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

  async goOnToSelectAvatar() {
    this.user.userId = this.userId;
    let docIdPromise = this.userFirebaseService.saveUserService(this.user);
    // this.sendDataToSelectAvatar();
    docIdPromise
      .then((docId) => {
        this.router.navigate([`avatarPicker/${docId}`]);
      })
      .catch((error) => {
        // Fehlerbehandlung
        console.error('Fehler beim Erhalten der Dokumenten-ID:', error);
      });

  }
}
