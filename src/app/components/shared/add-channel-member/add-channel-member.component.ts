import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { NgFor } from '@angular/common';
import { UserData } from '../../../services/firebase-user.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';

@Component({
  selector: 'app-add-channel-member',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, ContactButtonComponent, NgFor],
  templateUrl: './add-channel-member.component.html',
  styleUrl: './add-channel-member.component.scss'
})
export class AddChannelMemberComponent {
  authService = inject(FirebaseAuthService)
  getUserResults(query: string): UserData[] | undefined {
    let results = this.authService.allUsers.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    if (results.length > 5) results = results.slice(0, 5);
    return results;
  }

  selectUser(user: UserData) {
    console.log(`${user.name} was selected!`)
  }
}
