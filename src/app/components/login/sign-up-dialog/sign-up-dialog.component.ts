import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.scss',
})
export class SignUpDialogComponent {
  // requires:boolean = false;

  // form: FormGroup = new FormGroup({
  //   name: new FormControl('', Validators.required),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   passwort: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //   privacy: new FormControl(false, Validators.required)
  // })

  // get name() {return this.form.get("name")}
  // get email() {return this.form.get("email")}
  // get passwort() {return this.form.get("passwort")}
  // get privacy() {return this.form.get("privacy")}

  SingIn() {
    this.goOnToSelectAvatar()
  }

  backToLogIn() {
    let contactButton = document.getElementById('create-contact-button');
    let SingIn = document.getElementById('create-contact-dialog');
    let loginDialog = document.getElementById('login-dialog');

    SingIn?.classList.add('display_none');
    contactButton?.classList.remove('display_none');
    loginDialog?.classList.remove('display_none');
  }

  goOnToSelectAvatar(){
    let avatarDialog = document.getElementById('select-avatar-dialog');
    let SingIn = document.getElementById('create-contact-dialog');
    SingIn?.classList.add('display_none');
    avatarDialog?.classList.remove('display_none');
  }

}
