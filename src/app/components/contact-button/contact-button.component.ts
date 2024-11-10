import { Component, Input, OnChanges, inject } from '@angular/core';
import { ChatUser, UserData } from '../../models/app.model';
import { AsyncPipe, NgClass } from '@angular/common';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-button',
  standalone: true,
  imports: [NgClass, AsyncPipe],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.scss'
})
export class ContactButtonComponent implements OnChanges {
  @Input({ required: true }) user!: ChatUser | undefined;
  as = inject(FirebaseAuthService);
  ds = inject(DataService)
  userInfo!: Observable<UserData | undefined>

  ngOnChanges() {
    if (this.user) {
      this.userInfo = this.ds.getUser(this.user.id);
    }
  }
}
