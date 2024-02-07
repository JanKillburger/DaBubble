import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.scss'
})
export class SignUpDialogComponent {
  SingIn() {
    let avatarDialog = document.getElementById('select-avatar-dialog')
    let SingIn = document.getElementById('create-contact-dialog')
    
    SingIn?.classList.add('display_none')
    avatarDialog?.classList.remove('display_none')
  }

  backToLogIn(){
    let contactButton = document.getElementById('create-contact-button')
    let SingIn = document.getElementById('create-contact-dialog')
    let loginDialog = document.getElementById('login-dialog')
    
    SingIn?.classList.add('display_none')
    contactButton?.classList.remove('display_none')
    loginDialog?.classList.remove('display_none')
  }
}
