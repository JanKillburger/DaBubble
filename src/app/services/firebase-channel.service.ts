import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  Unsubscribe,
  setDoc,
} from '@angular/fire/firestore';
import { ChannelData, Chat, Message, messages, SearchData, UserData } from '../models/app.model';
import { FirebaseAuthService } from './firebase-auth.service';
import { Router } from '@angular/router';
import converters from './firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  firestore: Firestore = inject(Firestore)
  channelId: string = '';
  currentUser: string = '';
  currentChannel?: ChannelData;
  users: Map<string, UserData> = new Map();
  userChannels: ChannelData[] = [];
  userChannelsMessages: Map<string, messages> = new Map();
  replies: Map<string, Message[]> = new Map();
  currentChannelForMessages: string = 'grDvJ7eyWqziuvoDsr41';
  currentThreadForMessage: string | undefined = '';
  messagesToSeach: SearchData[] = [];
  chatMessagesToSeach: SearchData[] = [];
  userChats: Chat[] = [];
  userChatMessages: Map<string, messages> = new Map();
  userChatReplies: Map<string, Message[]> = new Map();
  unsub: Unsubscribe[] = []

  constructor(
    private router: Router,
    public authService: FirebaseAuthService
  ) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.unsub.forEach((unsub) => unsub());
      }
    })
  }
  
  editChannel(channel: ChannelData) {
    const docRef = doc(this.firestore, 'channels/' + channel.id).withConverter(
      converters.channel
    );
    setDoc(docRef, channel);
  }

  ngOnDestroy() {
    this.unsub.forEach((unsub) => unsub());
  }
}
