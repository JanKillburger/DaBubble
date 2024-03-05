import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { NgFor, NgIf } from '@angular/common';
import { UserData } from '../../../services/firebase-user.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { SelectedUserTagComponent } from '../../selected-user-tag/selected-user-tag.component';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../../services/home.service';

@Component({
  selector: 'app-add-channel-member',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, ContactButtonComponent, NgFor, SelectedUserTagComponent, NgIf, FormsModule],
  templateUrl: './add-channel-member.component.html',
  styleUrl: './add-channel-member.component.scss'
})
export class AddChannelMemberComponent {
  authService = inject(FirebaseAuthService);
  homeService = inject(HomeService);
  selectedUser: UserData | null = null;
  results: UserData[] | undefined;
  query = '';
  @Output() close = new EventEmitter<void>();

  getUserResults() {
    if (this.query === "") {
      this.results = [];
    } else {
      let results = this.authService.allUsers.filter(user => user.name.toLowerCase().includes(this.query.toLowerCase()));
      if (results.length > 5) results = results.slice(0, 5);
      this.results = results;
    }
  }

  selectUser(user: UserData) {
    this.selectedUser = user;
  }

  deselectUser() {
    this.selectedUser = null;
  }

  addUser() {
    this.selectedUser = null;
    this.results = [];
    this.query = "";
  }

  closeDialog() {
    this.close.emit();
  }
}
