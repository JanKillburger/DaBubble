import { Injectable } from '@angular/core';
import { ChannelData, Message } from './firebase-channel.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  selectedChannel: ChannelData | undefined;
  selectedMessage: Message | undefined;

  constructor() { }

  setChannel(channel: ChannelData) {
    this.selectedChannel = channel;
  }

  setThreadMessage(message: Message) {
    this.selectedMessage = message;
  }

  getActiveChannel() {
    return this.selectedChannel;
  }

  getThreadMessage() {
    return this.selectedMessage;
  }
}
