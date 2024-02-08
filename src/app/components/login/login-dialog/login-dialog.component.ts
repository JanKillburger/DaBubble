import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get email() {return this.logInForm.get("email")}
  get password() {return this.logInForm.get("password")}

  loginFunction(){
    
  }

  guestLogin(){
    
  }

  forgotPasswort(){
    let contactButton = document.getElementById('create-contact-button')
    let forgotPasswortDialog = document.getElementById('forgot-passwort-dialog')
    let loginDialog = document.getElementById('login-dialog')
    
    forgotPasswortDialog?.classList.remove('display_none')
    contactButton?.classList.add('display_none')
    loginDialog?.classList.add('display_none')
  }
}
