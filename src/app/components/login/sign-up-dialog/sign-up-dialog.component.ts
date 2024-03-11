import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { User } from '../../../models/user.class';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FirebaseChannelService } from '../../../services/firebase-channel.service';

@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: [
    './sign-up-dialog.component.scss',
    './mobileSign-up-dialog.component.scss',
  ],
})
export class SignUpDialogComponent {
  user = new User();
  userId: string = '';

  constructor(
    public userFirebaseService: FirebaseAuthService,
    private channelService: FirebaseChannelService,
    private router: Router
  ) {}

  singInForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.emailDomainValidator()
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    privacy: new FormControl(false, this.requiredTrueValidator()),
  });

  requiredTrueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === true ? null : { required: true };
    };
  }

  emailDomainValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const email: string = control.value || '';
      const domainPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValid = domainPattern.test(email);
      return isValid ? null : { 'invalidDomain': true };
    };
  }

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
    this.createUser();
    this.userId = await this.userFirebaseService.registerWithEmailAndPassword(
      this.user.email,
      this.password?.value
    );
    if (this.userId != 'error') {
      this.goOnToSelectAvatar();
    } else {
      console.log('user already exists');
    }
  }

  createUser() {
    if (this.name && this.email) {
      this.user.name = this.name.value;
      this.user.email = this.email.value;
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
    this.user.authId = this.userId;
    let docIdPromise = this.userFirebaseService.saveUserService(this.user);
    this.addUserToOpenChannels(this.userId)
    this.createdPersonalChat(this.userId)
    docIdPromise
      .then((docId) => {
        this.router.navigate([`avatarPicker/${docId}`]);
      })
      .catch((error) => {
        console.error('Fehler beim Erhalten der Dokumenten-ID:', error.message);
      });
  }

  addUserToOpenChannels(userId:any){
    this.channelService.addUserInOfficeChannel(userId)
  }

  createdPersonalChat(userId:any){
    this.channelService.addPersonalChat(userId)
  }
}
