import { Component } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  loginFunction(){
    
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
