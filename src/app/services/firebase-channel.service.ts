import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { UserData } from './firebase-user.service';
import { HomeService } from './home.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  //https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945
  //https://www.typescriptlang.org/docs/handbook/2/generics.html

  channels: ChannelData[] = [];
  unsubChannels;
  firestore: Firestore = inject(Firestore);
  channelId: string = '';
  currentUser: string = "Jh3fjqq46UNxdEagOB1Je6xa0Yg1";
  auth = getAuth();
  allChannels: Channel[] = [];
  currentChannel?: Channel;
  users: Map<string, UserData> = new Map();
  userChannels: ChannelData[] = [];
  userChannelsMessages: Map<string, messages> = new Map();
  replies: Map<string, Message[]> = new Map();
  unsubUsers: any[] = [];
  unsubReplies: any[] = [];
  unsubUserChannels: any[] = [];
  unsubUserChannelsMessages: any[] = [];
  converterMessage = {
    toFirestore: (data: Message) => {
      delete data.created;
      return data;
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
      const rawData = snap.data();
      rawData['created'] = new Date(snap.data()['timestamp']);
      return rawData as Message;
    },
  };
  converterUser = {
    toFirestore: (data: UserData) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => {
      return snap.data() as UserData;
    },
  };

  constructor(
    private homeService: HomeService,
    private router: Router,
    public authService: FirebaseAuthService
  ) {
    this.unsubChannels = this.subChannelsList();
    this.controlCurrentUser().then(() => {
      return this.getUserChannels(this.authService.loggedInUser);
    })
    .then((unsubUserChannels) => {
      this.unsubUserChannels.push(unsubUserChannels);
    })
  }
  
  async controlCurrentUser() {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.authService.loggedInUser = user.uid;
          this.router.navigate(['/home']);
          resolve(user.uid);
        } else {
          this.router.navigate(['/']);
          reject('error');
        }
      });
    });
  }

  getUserChannels(userId: string) {
    const q = query(
      collection(this.firestore, 'channels'),
      where('users', 'array-contains', userId)
    );
    return onSnapshot(q, (channels) => {
      this.userChannels = [];
      channels.forEach((channel) => {
        if (
          this.userChannels.length === 0 &&
          this.homeService.getScreenMode() !== 'small'
        )
          this.homeService.setChannel(channel.data() as ChannelData);
        this.userChannels.push(channel.data() as ChannelData);
        this.userChannels.at(-1)!.id = channel.id;
        this.getChannelUsers(channel.data() as ChannelData);
        if (!this.userChannelsMessages.has(channel.id)) {
          this.userChannelsMessages.set(channel.id, {});
          this.unsubUserChannelsMessages.push(
            this.getChannelMessages(channel.id)
          );
        }
      });
    });
  }

  private getChannelUsers(channel: ChannelData) {
    for (let user of channel.users) {
      if (!this.users.has(user)) {
        this.unsubUsers.push(
          onSnapshot(
            doc(this.firestore, 'users', user).withConverter(
              this.converterUser
            ),
            (user) => {
              this.users.set(user.id, user.data() as UserData);
            }
          )
        );
      }
    }
  }

  private getChannelMessages(channelId: string) {
    const messagesRef = query(
      collection(this.firestore, 'channels', channelId, 'messages'),
      orderBy('timestamp')
    ).withConverter(this.converterMessage);
    return onSnapshot(messagesRef, (messages) => {
      const messagesObj: messages = {};
      let dayKey = '';
      messages.forEach((message) => {
        const rawData = message.data();
        rawData['id'] = message.id;
        if (message.data()['date'] === dayKey) {
          messagesObj[dayKey].push(rawData);
        } else {
          dayKey = message.data()['date']!;
          messagesObj[dayKey] = [rawData];
        }
        this.getMessageReplies(channelId, message.id);
      });
      this.userChannelsMessages.set(channelId, messagesObj);
    });
  }

  private getMessageReplies(channelId: string, messageId: string) {
    const repliesRef = collection(
      this.firestore,
      'channels',
      channelId,
      'messages',
      messageId,
      'replies'
    ).withConverter(this.converterMessage);
    if (!this.replies.has(messageId)) {
      this.unsubReplies.push(
        onSnapshot(repliesRef, (replies) => {
          const value: Message[] = [];
          replies.forEach((reply) => value.push(reply.data()));
          this.replies.set(messageId, value);
        })
      );
    }
  }

  getCurrentUser() {
    return this.users.get(this.authService.loggedInUser);
  }

  getReplies(messageId: string) {
    return this.replies.get(messageId);
  }

  ngOnDestroy() {
    this.unsubChannels();
    this.unsubUserChannels.forEach((unsub) => unsub());
    this.unsubUserChannelsMessages.forEach((unsub) => unsub());
    this.unsubUsers.forEach((unsub) => unsub());
  }

  subChannelsList() {
    const q = query(this.getChannelsRef());
    return onSnapshot(q, (list) => {
      this.channels = [];
      list.forEach((element) => {
        this.channels.push(this.setChannelObject(element.data(), element.id));
      });
    });
  }

  setChannelObject(obj: any, id: string): ChannelData {
    return {
      id: id,
      channelName: obj.channelsName || 'unknown',
      channelDescription: obj.channelsDescription || '',
      users: obj.users || [],
    };
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getSingleChannelRef(ChannelId: string) {
    return doc(collection(this.firestore, 'channels'), ChannelId);
  }

  async getCurrentChannel(ChannelId: string) {
    await onSnapshot(this.getSingleChannelRef(ChannelId), (element) => {
      this.currentChannel = new Channel(element.data());
    });
  }

  async addChannel(channel: any): Promise<string> {
    const docRef = await addDoc(
      collection(this.firestore, 'channels'),
      channel.toJson()
    );
    this.channelId = docRef.id;
    return this.channelId;
  }

  async updateChannel(
    editChannel: any,
    editChannelId: string
  ): Promise<boolean> {
    try {
      await updateDoc(
        this.getSingleChannelRef(editChannelId),
        JSON.parse(JSON.stringify(editChannel))
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getChannelData() {
    this.allChannels = [];
    let querySnapshot = await getDocs(collection(this.firestore, 'channels'));
    querySnapshot.forEach((channel: any) => {
      let channelData: Channel = channel.data();
      this.allChannels.push(channelData);
    });
  }
}

export interface ChannelData {
  id?: string;
  createdBy?: string;
  channelName: string;
  channelDescription: string;
  users: string[];
}

export interface messages {
  [key: string]: Message[];
}

export interface Message {
  id: string;
  message: string;
  from?: string;
  timestamp?: number;
  date?: string;
  reactions?: any[];
  created?: Date;
}
