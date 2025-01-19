import { inject, Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, increment, query, runTransaction, setDoc, where, writeBatch } from '@angular/fire/firestore';
import { addDoc, collection, Transaction } from '@firebase/firestore';
import { filter, map, of, switchMap, tap } from 'rxjs';
import converters from './firestore-converters';
import { FirebaseAuthService } from './firebase-auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chat, ChatUser, DocData, Message, NewDocData, Reply, UserData } from '../models/app.model';
import { HomeService } from './home.service';

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
      //Set selectedChannel if it is undefined (initial load) or not contained in the user channels since user just left the channel
      if (channels.length > 0 && (!this.hs.selectedChannel() || !channels.find(ch => ch.id == this.hs.selectedChannel()!.id))) {
        this.hs.selectedChannel.set(channels[0])
      }
    }
    ),
  ), { initialValue: [] })

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

  addReactionToMessage(emoji: string, message: Message) {
    const db = this.fs;
    const currentUserId = this.as.loggedInUser();
    runTransaction(db, async function _addReactionToMessage(transaction: Transaction) {
      const messageSnap = await transaction.get(doc(db, message.path.join("/"), message.id).withConverter(converters.message));
      const reaction = messageSnap.data()?.reactions?.find(reaction => reaction.emoji == emoji);
      const otherReactions = messageSnap.data()!.reactions!.filter(reaction => reaction.emoji != emoji);
      if (reaction) {
        if (!reaction.userId.includes(currentUserId)) {
          transaction.update(messageSnap.ref, { reactions: [...otherReactions, { emoji, userId: [...reaction.userId, currentUserId] }] })
        }
      } else {
        transaction.update(messageSnap.ref, { reactions: [...otherReactions, { emoji, userId: [currentUserId] }] })
      }
    })
  }

  getChannel(channelId: string) {
    return this.as.user$.pipe(
      filter(user => user != null),
      switchMap(() =>
        docData(doc(this.fs, 'channels', channelId).withConverter(converters.channel))
      )
    )
  }

  getChannelMessages(channelId: string) {
    return this.as.user$.pipe(
      filter(user => user != null),
      switchMap(() =>
        collectionData(
          collection(
            this.fs, 'channels', channelId, 'messages')
            .withConverter(converters.message))
          .pipe(
            map(groupMessagesByDate)
          )
      )
    )
  }

  getChannelUsers(channelId: string) {
    return this.as.user$.pipe(
      filter(user => user != null),
      switchMap(() =>
        collectionData(
          query(
            collection(this.fs, 'users').withConverter(converters.user),
            where('channelIds', 'array-contains', channelId)
          )
        )
      )
    )
  }

  getChat(chatId: string) {
    return this.as.user$.pipe(
      filter(user => user != null),
      switchMap(() => docData(doc(this.fs, 'chats', chatId).withConverter(converters.chat))
      )
    )
  }

  getChatMessages(chatId: string) {
    return this.as.user$.pipe(
      filter(user => user != null),
      switchMap(() => collectionData(
        collection(this.fs, 'chats', chatId, 'messages')
          .withConverter(converters.message)
      ).pipe(
        map(groupMessagesByDate)
      )
      )
    )
  }

  getMessageReplies(message: Message) {
    const topCollection = message.path.includes('chats') ? 'chats' : 'channels';
    const topCollectionDocId = message.path[1];
    return collectionData(
      collection(this.fs, topCollection, topCollectionDocId, 'messages', message.id, 'replies')
        .withConverter(converters.reply)
    ).pipe(
      map(messages => messages.sort((a, b) => a.timestamp - b.timestamp))
    )
  }

  getUser(id: string) {
    return this.as.user$.pipe(
      filter(user => user != null),
      switchMap(() => docData(doc(this.fs, 'users', id).withConverter(converters.user))
      )
    )
  }

  createReply(reply: Omit<Reply, "id">, message: Message) {
    const batch = writeBatch(this.fs);
    batch.set(doc(collection(this.fs, [...message.path, message.id, "replies"].join("/"))).withConverter(converters.reply), reply);
    batch.update(doc(this.fs, [...message.path, message.id].join("/")), { repliesCount: increment(1), lastReplyAt: Date.now() });
    batch.commit();
  }

  getDirectChat(chatId: string) {
    return this.userChats().find((chat) => chat.id === chatId) || null;
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
