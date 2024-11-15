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
  arrayUnion,
  Unsubscribe,
  setDoc,
} from '@angular/fire/firestore';
import { ChannelData, Chat, Message, messages, SearchData, UserData } from '../models/app.model';
import { HomeService } from './home.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { Router } from '@angular/router';
import converters from './firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  firestore: Firestore = inject(Firestore)

  // channels: ChannelData[] = [];
  channelId: string = '';
  currentUser: string = '';
  // allChannels: ChannelData[] = [];
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
    private homeService: HomeService,
    private router: Router,
    public authService: FirebaseAuthService
  ) {
    // this.subChannelsList();
    this.authService.user$.subscribe(user => {
      if (user) {
        this.getUserChats(this.authService.loggedInUser());
        this.getUserChannels(this.authService.loggedInUser());
        this.router.navigate(['/home']);
      } else {
        this.unsub.forEach((unsub) => unsub());
      }
    })
  }

  getUserChats(userId: string) {
    const q = query(
      collection(this.firestore, 'chats'),
      where('users', 'array-contains', userId)
    );
    this.unsub.push(
      onSnapshot(q, (chats) => {
        this.userChats = [];
        chats.forEach((chat) => {
          let rawData = chat.data();
          rawData['id'] = chat.id;
          this.userChats.push(rawData as Chat);
          if (!this.userChatMessages.has(chat.id)) {
            this.userChatMessages.set(chat.id, {});
            this.getChatMessages(chat.id)
          }
        });
      }));
  }

  private getChatMessages(chatId: string) {
    const messagesRef = query(
      collection(this.firestore, 'chats', chatId, 'messages'),
      orderBy('timestamp')
    ).withConverter(converters.message);
    this.unsub.push(
      onSnapshot(messagesRef, (messages) => {
        const messagesObj: messages = {};
        let dayKey = '';
        messages.forEach((message) => {
          let rawData = message.data();
          rawData['id'] = message.id;
          // this.saveChatMessageForSearchingFiel(
          //   chatId,
          //   rawData.message,
          //   message.id
          // );
          if (message.data()['date'] === dayKey) {
            messagesObj[dayKey].push(rawData);
          } else {
            dayKey = message.data()['date']!;
            messagesObj[dayKey] = [rawData];
          }
          this.getChatReplies(chatId, message.id);
        });
        this.userChatMessages.set(chatId, messagesObj);
      }));
  }

  private getChatReplies(chatId: string, messageId: string) {
    const repliesRef = query(
      collection(
        this.firestore,
        'chats',
        chatId,
        'messages',
        messageId,
        'replies'
      ),
      orderBy('timestamp')
    ).withConverter(converters.message);

    if (!this.userChatReplies.has(messageId)) {
      this.unsub.push(
        onSnapshot(repliesRef, (replies) => {
          const value: Message[] = [];
          replies.forEach((reply) => {
            let rawData = reply.data();
            rawData['id'] = reply.id;
            const replyData = rawData as Message;
            replyData.id = reply.id;
            value.push(replyData);
          });
          this.userChatReplies.set(messageId, value);
        })
      );
    }
  }

  getUserChannels(userId: string) {
    const q = query(
      collection(this.firestore, 'channels'),
      where('users', 'array-contains', userId)
    );
    this.unsub.push(
      onSnapshot(q, (channels) => {
        this.userChannels = [];
        channels.forEach((channel) => {
          let rawData = channel.data();
          rawData['id'] = channel.id;
          if (
            !this.homeService.selectedChannel() &&
            this.homeService.screenMode() !== 'small'
          )
            this.homeService.setChannel(rawData as ChannelData);
          this.userChannels.push(rawData as ChannelData);
          this.userChannels.at(-1)!.id = channel.id;
          // this.getChannelUsers(rawData as ChannelData);
          if (!this.userChannelsMessages.has(channel.id)) {
            this.userChannelsMessages.set(channel.id, {});
            this.getChannelMessages(channel.id);
          }
        });
      }));
  }

  // private getChannelUsers(channel: ChannelData) {
  //   for (let user of channel.users) {
  //     if (!this.users.has(user)) {
  //       this.unsub.push(
  //         onSnapshot(
  //           doc(this.firestore, 'users', user).withConverter(
  //             converters.user
  //           ),
  //           (user) => {
  //             let rawData = user.data();
  //             if (rawData) {
  //               rawData['id'] = user.id;
  //               this.users.set(user.id, rawData as UserData);
  //             }
  //           }
  //         )
  //       );
  //     }
  //   }
  // }

  private getChannelMessages(channelId: string) {
    const messagesRef = query(
      collection(this.firestore, 'channels', channelId, 'messages'),
      orderBy('timestamp')
    ).withConverter(converters.message);
    this.unsub.push(
      onSnapshot(messagesRef, (messages) => {
        const messagesObj: messages = {};
        let dayKey = '';
        messages.forEach((message) => {
          let rawData = message.data();
          rawData['id'] = message.id;
          this.saveMessageForSearchingFiel(
            channelId,
            rawData.message,
            message.id
          );
          if (message.data()['date'] === dayKey) {
            messagesObj[dayKey].push(rawData);
          } else {
            dayKey = message.data()['date']!;
            messagesObj[dayKey] = [rawData];
          }
          this.getMessageReplies(channelId, message.id);
        });
        this.userChannelsMessages.set(channelId, messagesObj);
      }));
  }

  editChannel(channel: ChannelData) {
    const docRef = doc(this.firestore, 'channels/' + channel.id).withConverter(
      converters.channel
    );
    setDoc(docRef, channel);
  }

  saveMessageForSearchingFiel(
    channelId: string,
    message: string,
    messageId: string
  ) {
    let searchData: SearchData = {
      channelId: '',
      channelName: '',
      messageId: '',
      message: '',
    };
    searchData.channelId = channelId;
    searchData.channelName = this.getChannelName(channelId);
    searchData.messageId = messageId;
    searchData.message = message;
    this.messagesToSeach.push(searchData);
  }

  // saveChatMessageForSearchingFiel(
  //   chatId: string,
  //   message: string,
  //   messageId: string
  // ) {
  //   let searchData: SearchData = {
  //     channelId: '',
  //     channelName: '',
  //     messageId: '',
  //     message: '',
  //   };
  //   searchData.channelId = chatId;
  //   searchData.channelName = this.getChatPartner(chatId);
  //   searchData.messageId = messageId;
  //   searchData.message = message;
  //   this.chatMessagesToSeach.push(searchData);
  // }

  getChannelName(channelId: string) {
    let currentChannel = this.userChannels.filter((channels) =>
      channels.id!.includes(channelId)
    );
    return currentChannel[0].channelName;
  }

  // getChatPartner(chatId: string): string {
  //   let currentChat = this.userChats.filter((chat) =>
  //     chat.id!.includes(chatId)
  //   );

  //   for (let userArray of currentChat) {
  //     for (let user of userArray.users) {
  //       if (user !== this.authService.loggedInUser()) {
  //         let chatUser = this.authService.allUsers.filter((u) =>
  //           u.userId.includes(user)
  //         );
  //         return chatUser.length > 0 ? chatUser[0].name : '';
  //       }
  //     }
  //   }
  //   return '';
  // }

  private getMessageReplies(channelId: string, messageId: string) {
    const repliesRef = query(
      collection(
        this.firestore,
        'channels',
        channelId,
        'messages',
        messageId,
        'replies'
      ),
      orderBy('timestamp')
    ).withConverter(converters.message);
    if (!this.replies.has(messageId)) {
      this.unsub.push(
        onSnapshot(repliesRef, (replies) => {
          const value: Message[] = [];
          replies.forEach((reply) => {
            let rawData = reply.data();
            rawData['id'] = reply.id;
            const replyData = rawData as Message;
            replyData.id = reply.id;
            value.push(replyData);
          });
          this.replies.set(messageId, value);
        })
      );
    }
  }

  getReplies(messageId: string) {
    return this.replies.get(messageId);
  }

  ngOnDestroy() {
    this.unsub.forEach((unsub) => unsub());
  }

  // subChannelsList() {
  //   const q = query(this.getChannelsRef());
  //   this.unsub.push(
  //     onSnapshot(q, (list) => {
  //       this.channels = [];
  //       list.forEach((element) => {
  //         this.channels.push(this.setChannelObject(element.data(), element.id));
  //       });
  //     }));
  // }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getSingleChannelRef(ChannelId: string) {
    return doc(collection(this.firestore, 'channels'), ChannelId).withConverter(converters.channel);
  }

  async getCurrentChannel(ChannelId: string) {
    await onSnapshot(this.getSingleChannelRef(ChannelId), (element) => {
      this.currentChannel = element.data();
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
      return false;
    }
  }

  // async getChannelData() {
  //   this.allChannels = [];
  //   let querySnapshot = await getDocs(collection(this.firestore, 'channels').withConverter(converters.channel));
  //   querySnapshot.forEach((channel: any) => {
  //     this.allChannels.push(channel.data());
  //   });
  // }

  

  setChannelObject(obj: any, id: string): ChannelData {
    return {
      id: id,
      kind: 'channel',
      path: ['channels'],
      converter: converters.channel,
      channelName: obj.channelsName || 'unknown',
      channelDescription: obj.channelsDescription || '',
      users: obj.users || [],
      channelCreator: obj.channelCreater || '',
    };
  }
}

