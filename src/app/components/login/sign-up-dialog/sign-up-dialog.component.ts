import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { DataService } from '../../../services/data.service';

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
  ds = inject(DataService)
  user = new User();
  userId: string = '';

  constructor(
    public userFirebaseService: FirebaseAuthService,
    private router: Router
  ) { }

  signInForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/\S+@\S+\.(\S){2,4}/)
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

  get name() {
    return this.signInForm.get('name');
  }
  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }
  get privacy() {
    return this.signInForm.get('privacy');
  }

  async onSubmit() {
    this.createUser();
    this.userId = await this.userFirebaseService.registerWithEmailAndPassword(
      this.user.email,
      this.password?.value,
      this.user.name
    );
    if (this.userId != 'error') {
      this.router.navigate(['avatarPicker', this.userId]);
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
    let SignIn = document.getElementById('create-contact-dialog');
    let loginDialog = document.getElementById('login-dialog');

    SignIn?.classList.add('display_none');
    contactButton?.classList.remove('display_none');
    loginDialog?.classList.remove('display_none');
  }
}
