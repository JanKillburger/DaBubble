import { Component, Input, inject } from '@angular/core';
import { UserData } from '../../services/firebase-user.service';
import { NgClass } from '@angular/common';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FirebaseChannelService } from '../../services/firebase-channel.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-contact-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.scss'
})
export class ContactButtonComponent {
@Input() user: UserData | undefined
channelService = inject(FirebaseChannelService);


}
