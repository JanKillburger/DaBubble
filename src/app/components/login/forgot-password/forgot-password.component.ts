import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get email() {return this.forgotPasswordForm.get("email")}

  backToLogIn(){
    let contactButton = document.getElementById('create-contact-button')
    let forgotPasswortDialog = document.getElementById('forgot-passwort-dialog')
    let loginDialog = document.getElementById('login-dialog')
    
    forgotPasswortDialog?.classList.add('display_none')
    contactButton?.classList.remove('display_none')
    loginDialog?.classList.remove('display_none')
  }


  sendResetPasswortMail(){
    
  }
}
