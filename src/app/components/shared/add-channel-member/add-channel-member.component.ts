import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactButtonComponent } from '../../contact-button/contact-button.component';
import { NgFor, NgIf } from '@angular/common';
import { UserData } from '../../../models/app.model';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { SelectedUserTagComponent } from '../../selected-user-tag/selected-user-tag.component';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../../services/home.service';
import { SearchService } from '../../../search.service';

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
  searchService = inject(SearchService);
  selectedUser: UserData | null = null;
  results: UserData[] | undefined;
  query = '';
  @Output() close = new EventEmitter<void>();

  getUserResults() {
    if (this.query === "") {
      this.results = [];
    } else {
      let results = this.searchService.users()!.filter(user =>
        user.name.toLowerCase().includes(this.query.toLowerCase()) &&
        !this.homeService.selectedChannel()?.users.includes(user.userId));
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
    if (this.selectedUser && this.homeService.selectedChannel()) this.authService.addUsersToChannel([this.selectedUser], this.homeService.selectedChannel()!.id)
    this.selectedUser = null;
    this.results = [];
    this.query = "";
    this.closeDialog();
  }

  closeDialog() {
    this.close.emit();
  }
}
