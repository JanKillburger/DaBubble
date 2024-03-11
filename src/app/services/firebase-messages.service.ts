import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { FirebaseChannelService, Message, messages } from './firebase-channel.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { Unsubscribe } from '@angular/fire/auth';
import { HomeService } from './home.service';

@Injectable({ providedIn: 'root' })
export class FirebaseMessageService {
  firestore: Firestore = inject(Firestore);
  messageMatches: any;
  searchTerm: any = '';
  currentMatchId: string = '';
  currentMatchIndex: number = -1;
  channelOrChatValue: string = ''
  channelOrChatId: string = ''

  constructor(
    private channel: FirebaseChannelService,
    private authService: FirebaseAuthService,
    private homeService: HomeService
  ) {}

  

  getMessagesFromChannel(channel: string) {
    this.channel.currentChannelForMessages = channel;
  }

  getThredFromMessage(threadId: string) {
    this.channel.currentThreadForMessage = threadId;
  }

  updateMessage(message: string, currentUser: any, path: string, type: string | undefined) {
    let now = new Date(Date.now());
    let formattedDate = this.formatDate(now);
    this.checkItIsChannelORChat(type)
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
      return this.channelOrChatValue + this.channelOrChatId + '/messages';
    } else {
      return (
        this.channelOrChatValue +
        this.channelOrChatId +
        '/messages/' +
        this.homeService.selectedMessage?.id +
        '/replies'
      );
    }
  }

  checkItIsChannelORChat(type: string | undefined){
    if (type === 'user') {
      this.channelOrChatValue =  'chats/'
      this.channelOrChatId = this.homeService.selectedChat?.id!
    } else if (type === 'channel'){
      this.channelOrChatValue = 'channels/'
      this.channelOrChatId = this.homeService.selectedChannel?.id!
    } else {
      console.error('No Channel or Chat is defined')
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  UpdateMessageWithEmojis(
    emoji: any,
    MessagePath: string | undefined,
    reactions: any,
    container: string
  ) {
    let emojiIsInDB = this.emojiAlreadyUsed(emoji, reactions);
    let emojiPath = this.checkItIsEmojiForMessageOrThread(
      container,
      MessagePath
    );
    if (emojiIsInDB) {
      let iUseTheEmojiBefore = emojiIsInDB.userId.find((user: any) =>
      user.includes(this.authService.loggedInUser)
      );
      if (iUseTheEmojiBefore) {
        this.deleteUserForEmoji(emoji, reactions, emojiPath);
      } else {
        this.addUserForEmoji(emoji, reactions, emojiPath);
      }
    } else {
      this.addEmojiinDB(emoji, emojiPath);
    }
  }

  checkItIsEmojiForMessageOrThread(
    path: string,
    MessagePath: string | undefined
  ) {
    if (path === 'channel') {
      return (
        'channels/' +
        this.channel.currentChannelForMessages +
        '/messages/' +
        MessagePath
      );
    } else {
      return (
        'channels/' +
        this.channel.currentChannelForMessages +
        '/messages/' +
        this.channel.currentThreadForMessage +
        '/replies/' +
        MessagePath
      );
    }
  }

  addUserForEmoji(emoji: any, reactions: any, emojiPath: string) {
    const reactionToUpdate = reactions.find(
      (reaction: any) => reaction.emoji === emoji.emoji
    );
    if (!reactionToUpdate.userId.includes(this.authService.loggedInUser)) {
      reactionToUpdate.userId.push(this.authService.loggedInUser);
      const messageRef = doc(this.firestore, emojiPath);
      updateDoc(messageRef, { reactions: reactions });
    }
  }

  deleteUserForEmoji(emoji: any, reactions: any, emojiPath: string) {
    const reactionIndex = reactions.findIndex(
      (reaction: any) => reaction.emoji === emoji.emoji
    );
    const reactionToUpdate = reactions[reactionIndex];
    const userIndex = reactionToUpdate.userId.indexOf(
      this.authService.loggedInUser
    );
    if (userIndex > -1) {
      reactionToUpdate.userId.splice(userIndex, 1);
      if (reactionToUpdate.userId.length === 0) {
        reactions.splice(reactionIndex, 1);
      }
      const messageRef = doc(this.firestore, emojiPath);
      updateDoc(messageRef, { reactions: reactions });
    }
  }

  addEmojiinDB(emoji: any, emojiPath: string) {
    const newReaction = {
      emoji: emoji,
      userId: [this.authService.loggedInUser],
    };
    const messageRef = doc(this.firestore, emojiPath);
    updateDoc(messageRef, { reactions: arrayUnion(newReaction) });
  }

  emojiAlreadyUsed(emoji: any, reactions: any) {
    return reactions.find((reaction: any) => reaction.emoji === emoji.emoji);
  }

  searchingMessages(searchTerm: string) {
    this.searchTerm = searchTerm;
    let currentMessages = this.channel.messagesToSeach.filter((channel) =>
      channel.channelId.includes(this.channel.currentChannelForMessages)
    );
    this.messageMatches = currentMessages.filter((message) =>
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.goToNextMatch(0)
    if (this.searchTerm == "") {
      this.currentMatchId = ""
    }
  }

  goToNextMatch(plusOrMinus: number) {
    if (this.messageMatches.length > 0) {
      this.currentMatchIndex = this.currentMatchIndex + plusOrMinus
      this.currentMatchIndex = (this.currentMatchIndex) % this.messageMatches.length;
      this.currentMatchId = this.messageMatches[this.currentMatchIndex].messageId;
      this.scrollToElement(this.currentMatchId);
    } 
  }

  scrollToElement(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
