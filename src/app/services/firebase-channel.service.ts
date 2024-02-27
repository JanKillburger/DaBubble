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
  currentUser: string = 'yoYpfM7zqselK2fBnIdS'

  allChannels: Channel[];
  currentChannel?: Channel;
  userChannels: ChannelData[] = [];
  userChannelsMessages: Map<string, messages> = new Map();
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
    }
  }

  constructor() {
    this.unsubChannels = this.subChannelsList();
    this.unsubUserChannels.push(this.getUserChannels(this.currentUser));
    this.allChannels = [];
  }

  getUserChannels(userId: string) {//aktuell noch hard-coded gegen Testnutzer Noah Braun abgefragt
    const q = query(collection(this.firestore, "channels"), where("users", "array-contains", userId));
    return onSnapshot(q, channels => {
      this.userChannels = [];
      channels.forEach(channel => {
        this.userChannels.push(channel.data() as ChannelData);
        if (!this.userChannelsMessages.has(channel.id)) {
          console.log('subscribing channel', channel.data()['channelName']);
          this.userChannelsMessages.set(channel.id, {});
          this.unsubUserChannelsMessages.push(this.getChannelMessages(channel.id));
        }
      })
    })
  }

  getChannelMessages(channelId: string) {
    const messagesRef = query(collection(this.firestore, "channels", channelId, "messages"), orderBy("timestamp")).withConverter(this.converterMessage);
    return onSnapshot(messagesRef, messages => {
      const messagesObj: messages = {};
      let dayKey = '';
      messages.forEach(message => {
        if (message.data()['date'] === dayKey) {
          messagesObj[dayKey].push(message.data());
        } else {
          dayKey = message.data()['date']!;
          messagesObj[dayKey] = [message.data()];
        }
      });
      this.userChannelsMessages.set(channelId, messagesObj);
      console.log(this.userChannelsMessages);
    }
    )
  }

  ngOnDestroy() {
    this.unsubChannels();
    this.unsubUserChannels.forEach(unsub => unsub());
    this.unsubUserChannelsMessages.forEach(unsub => unsub());
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
  channelName: string;
  channelDescription: string;
  users: string[];
}

export interface messages {
  [key: string]: Message[];
}

export interface Message {
  message: string;
  from?: string;
  timestamp?: number;
  date?: string;
  reactions?: any[];
  created?: Date
}