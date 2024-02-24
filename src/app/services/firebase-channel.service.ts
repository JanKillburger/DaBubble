import { Injectable, inject } from '@angular/core';
import {
  Firestore,
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
  channels: ChannelData[] = [];
  unsubChannels;
  firestore: Firestore = inject(Firestore);
  channelId: string = '';

  allChannels: Channel[];
  currentChannel?: Channel;
  currentUser: string = 'yoYpfM7zqselK2fBnIdS'
  userChannels: ChannelData[] = [];
  userChannelsMessages: Map<string, any[]> = new Map();
  unsubUserChannels: any[] = [];
  unsubUserChannelsMessages: any[] = [];

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
          this.userChannelsMessages.set(channel.id, []);
          this.unsubUserChannelsMessages.push(this.getChannelMessages(channel.id));
        }
      })
    })
  }

  getChannelMessages(channelId: string) {
    const messagesRef = query(collection(this.firestore, "channels", channelId, "messages"), orderBy("timestamp"));
    return onSnapshot(messagesRef, messages => {
      const messagesArr: any[] = [];
      let dayKey = '';
      let currentIndex = 0;
      messages.forEach(message => {
        if (message.data()['date'] === dayKey) {
          messagesArr[currentIndex].push(message.data());
        } else {
          dayKey = message.data()['date'];
          currentIndex = messagesArr.push({ [dayKey]: [message.data()] }) - 1;
        }
      });
      this.userChannelsMessages.set(channelId, messagesArr);
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

interface Message {
  message: string;
}