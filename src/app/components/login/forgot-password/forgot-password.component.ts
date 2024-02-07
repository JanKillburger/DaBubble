import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  backToLogIn(){
    let contactButton = document.getElementById('create-contact-button')
    let forgotPasswortDialog = document.getElementById('forgot-passwort-dialog')
    let loginDialog = document.getElementById('login-dialog')
    
    forgotPasswortDialog?.classList.add('display_none')
    contactButton?.classList.remove('display_none')
    loginDialog?.classList.remove('display_none')
  }
}
