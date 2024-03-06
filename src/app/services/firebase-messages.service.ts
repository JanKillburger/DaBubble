import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { FirebaseChannelService, Message } from './firebase-channel.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { Console } from 'console';

@Injectable({ providedIn: 'root' })
export class FirebaseMessageService {
  firestore: Firestore = inject(Firestore);
  constructor(
    private channel: FirebaseChannelService,
    private authService: FirebaseAuthService
  ) {}

  getMessagesFromChannel(channel: string) {
    this.channel.currentChannelForMessages = channel;
  }

  getThredFromMessage(threadId: string) {
    this.channel.currentThreadForMessage = threadId;
  }

  updateMessage(message: string, currentUser: any, path: string) {
    let now = new Date(Date.now());
    let formattedDate = this.formatDate(now);
    let currentPath = this.checkItIsMessageOrThread(path);
    let newMessage: Message = {
      date: formattedDate,
      from: currentUser,
      message: message,
      reactions: [],
      timestamp: Date.now(),
    };
    const messagesRef = collection(this.firestore, currentPath);
    const messageJson = this.messageToJson(newMessage);
    addDoc(messagesRef, messageJson).then(() => {});
  }

  checkItIsMessageOrThread(path: string) {
    if (path === 'message') {
      return 'channels/' + this.channel.currentChannelForMessages + '/messages';
    } else {
      return (
        'channels/' +
        this.channel.currentChannelForMessages +
        '/messages/' +
        this.channel.currentThreadForMessage +
        '/replies'
      );
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  UpdateMessageWithEmojis(emoji:any, MessagePath:string | undefined, reactions:any) {
    let emojiIsInDB = this.emojiAlreadyUsed(emoji, reactions);
    if (emojiIsInDB) {
      this.addUserForEmoji(emoji, MessagePath, reactions);
    } else {
      this.addEmojiinDB(emoji, MessagePath);
    }
  }

  addUserForEmoji(emoji: any, MessagePath: string | undefined, reactions: any) {
  let emojiPath = 'channels/' + this.channel.currentChannelForMessages + '/messages/' + MessagePath;
  const reactionToUpdate = reactions.find((reaction: any) => reaction.emoji === emoji);
  if (!reactionToUpdate.userId.includes(this.authService.loggedInUser)) {
    reactionToUpdate.userId.push(this.authService.loggedInUser);
    const messageRef = doc(this.firestore, emojiPath);
    updateDoc(messageRef, { reactions: reactions });
  }
  }

  addEmojiinDB(emoji: any, MessagePath: string | undefined) {
    let emojiPath = 'channels/' + this.channel.currentChannelForMessages + '/messages/' + MessagePath;
    const newReaction = {
      emoji: emoji,
      userId: [this.authService.loggedInUser],
    };
    const messageRef = doc(this.firestore, emojiPath);
    updateDoc(messageRef, { reactions: arrayUnion(newReaction) });
  }

  emojiAlreadyUsed(emoji: any, reactions: any) {
    return reactions.some((reaction: any) => reaction.emoji === emoji);
  }

  messageToJson(message: Message) {
    return {
      message: message.message,
      from: message.from,
      timestamp: message.timestamp,
      date: message.date,
      reactions: message.reactions,
    };
  }
}
