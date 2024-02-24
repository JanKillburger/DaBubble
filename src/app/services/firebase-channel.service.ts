import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
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
  channelId: string = '';
  allChannels: Channel[];
  currentChannel?: Channel;

  constructor() {
    this.unsubChannels = this.subChannelsList();
    this.allChannels = [];
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

  getSingleChannelRef(ChannelId: string) {
    return doc(collection(this.firestore, 'channels'), ChannelId);
  }

  getCurrentChannel(ChannelId: string) {
    onSnapshot(this.getSingleChannelRef(ChannelId), (element) => {
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

interface ChannelData {
  id?: string;
  channelName: string;
  channelDescription: string;
  users: string[];
}
