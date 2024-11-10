import { inject, Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { addDoc, collection, getDoc } from '@firebase/firestore';
import { filter, firstValueFrom, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import converters from './firestore-converters';
import { FirebaseAuthService } from './firebase-auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chat, ChatUser, DocData, Message, NewDocData, UserData } from '../models/app.model';
import { HomeService } from './home.service';
import { group } from 'console';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private fs = inject(Firestore)
  private as = inject(FirebaseAuthService)
  private hs = inject(HomeService)

  userChannels = toSignal(toObservable(this.as.userProfile).pipe(
    switchMap(
      user => {
        if (user) {
          return collectionData(
            query(
              collection(this.fs, 'channels'),
              where('userIds', 'array-contains', user.id)).withConverter(converters.channel)
          )
        } else {
          return of([])
        }
      }
    ),
    tap(channels => {
      if (channels.length > 0) {
        this.hs.selectedChannel.set(channels[0])
      }
    })), { initialValue: [] })

  private _getChatRecipient(chat: Chat, user: UserData): ChatUser {
    const recipientId = chat.users?.find(userId => userId != user.id);
    if (recipientId === undefined) {
      return user;
    } else {
      return chat.participants![recipientId]
    }
  }

  userChats = toSignal(toObservable(this.as.userProfile).pipe(
    switchMap(
      user => {
        if (user) {
          return collectionData(
            query(
              collection(this.fs, 'chats'),
              where('userIds', 'array-contains', user.id)).withConverter(converters.chat)
          ).pipe(
            map(
              chats => chats.map(chat => ({ ...chat, recipient: this._getChatRecipient(chat, user) }))
            )
          )
        } else {
          return of([])
        }
      })
  ), { initialValue: [] })

  async saveDoc<T extends NewDocData | DocData>(docData: T) {
    if ('id' in docData) {
      return setDoc(
        doc(this.fs, docData.path.join('/'), docData.id)
          .withConverter(docData.converter),
        docData
      )
    } else {
      return await addDoc(
        collection(this.fs, docData.path.join('/'))
          .withConverter(docData.converter),
        docData
      );
    }
  }

  getChannel(channelId: string) {
    return docData(doc(this.fs, 'channels', channelId).withConverter(converters.channel))
  }

  getChannelMessages(channelId: string) {
    return collectionData(
      collection(
        this.fs, 'channels', channelId, 'messages')
        .withConverter(converters.message))
      .pipe(
        map(groupMessagesByDate)
      )
  }

  getChannelUsers(channelId: string) {
    return collectionData(
      query(
        collection(this.fs, 'users').withConverter(converters.user),
        where('channelIds', 'array-contains', channelId)
      )
    )
  }

  getChat(chatId: string) {
    return docData(doc(this.fs, 'chats', chatId).withConverter(converters.chat))
  }

  getChatMessages(chatId: string) {
    return collectionData(
      collection(this.fs, 'chats', chatId, 'messages')
        .withConverter(converters.message)
    ).pipe(
      map(groupMessagesByDate)
    )
  }

  getMessageReplies(message: Message) {
    const topCollection = message.path.includes('chats') ? 'chats' : 'channels';
    const topCollectionDocId = message.path[1]
    return collectionData(
      collection(this.fs, topCollection, topCollectionDocId, 'messages', message.id, 'replies')
        .withConverter(converters.reply)
    )
  }

  getUser(id: string) {
    return docData(doc(this.fs, 'users', id).withConverter(converters.user))
  }
}


function groupMessagesByDate(messages: Message[]): { [date: string]: Message[] } {
  messages.sort((a, b) => a.timestamp - b.timestamp);
  let result: { [date: string]: Message[] } = {};
  for (let message of messages) {
    if (result[message.date!]) {
      result[message.date!].push(message);
    } else {
      result[message.date!] = [message];
    }
  }
  return result;
}
