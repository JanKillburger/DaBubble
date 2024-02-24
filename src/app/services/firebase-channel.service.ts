import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  channels: ChannelData[] = [];
  unsubChannels;
  firestore: Firestore = inject(Firestore);
  channelId: string = ''

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

  getSingleChannelRef(UserId: string) {
    return doc(collection(this.firestore, 'users'), UserId);
  }

  async addChannel(channel: any): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, 'channels'), channel.toJson());
    this.channelId = docRef.id;
    return this.channelId;
  }

  async updateChannel(editChannel: any, editChannelId: string): Promise<boolean> {
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
}

interface ChannelData {
  id?: string;
  channelName: string;
  channelDescription: string;
  users: string[];
}