import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  onSnapshot,
  query,
} from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  channels: ChannelData[] = [];
  unsubChannels;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubChannels = this.subChannelsList();
  }

  ngonDestroy() {
    this.unsubChannels();
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

  addChannel(channel:any) {
    addDoc(collection(this.firestore, 'channels'), channel.toJSON()).then(() => {
    });
  }
}

interface ChannelData {
  id?: string;
  channelName: string;
  channelDescription: string;
  users: string[];
}
