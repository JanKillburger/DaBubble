import { Injectable, computed, inject } from '@angular/core';
import {
  Firestore,
  Transaction,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  docData,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  Auth,
  user,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { filter, shareReplay, switchMap } from 'rxjs';
import converters from './firestore-converters';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserData } from '../models/app.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  firestore = inject(Firestore);
  auth = inject(Auth);
  //"Cloud Functions Section" START: should be moved to a Cloud Function, each function defines the
  //trigger it would typcially use

  //New user setup: triggered upon account creation in Authentication module
  //Creates user profile, personal chat and adds user to the Welcome channel (creates the channel
  // if not already existing) 

  private async setUpNewUser(id: string, name: string, email: string) {
    let userDoc = await getDoc(doc(this.firestore, 'users', id).withConverter(converters.user))
    if (!userDoc.exists()) {
      await setDoc(doc(this.firestore, 'users', id)
        .withConverter(converters.user),
        {
          id,
          authId: id,
          userId: id,
          kind: 'user',
          path: ['users'],
          converter: converters.user,
          channelIds: ['AllUsersChannel'],
          email: email || '',
          name: name || '',
          online: true,
          avatar: './assets/img/login/signin/avatar1.png',
        });
      userDoc = await getDoc(userDoc.ref);
      await addDoc(collection(this.firestore, 'chats')
        .withConverter(converters.chat),
        {
          id,
          kind: 'chat',
          path: ['chats'],
          converter: converters.chat,
          users: [id],
          participants: {
            [id]: {
              id,
              name: name || ''
            }
          }
        });
      const channelRef = doc(this.firestore, 'channels', 'AllUsersChannel')
        .withConverter(converters.channel);
      const channelDoc = await getDoc(channelRef);
      if (!channelDoc.exists()) {
        setDoc(channelRef,
          {
            id: 'AllUsersChannel',
            kind: 'channel',
            path: ['channels'],
            converter: converters.channel,
            channelCreator: 'Admin',
            channelName: 'Welcome',
            channelDescription: 'All new users are added to this channel to start talking to each other',
            users: [id],
            previewUserIds: [id],
            previewUsers: {
              [id]: {
                avatar: './assets/img/login/signin/avatar1.png'
              }
            }
          }
        )
      } else {
        this.addUserToChannel(userDoc.data()!, 'AllUsersChannel')
      }
    }
  }

  //Sync user profile changes that affect other documents due to duplicated data

  private getUserChanges([previousData, data]: [UserData, UserData]) {
    let changes: Partial<UserData> = {};
    if (data.name !== previousData.name) {
      changes.name = data.name
    }
    if (data.avatar !== previousData.avatar) {
      changes.avatar = data.avatar
    }
    return changes;
  }

  private async processUserChange(user: UserData, transaction: Transaction) {
    const fs = this.firestore;
    async function updateChannels() {
      (await getDocs(
        query(
          collection(fs, 'channels')
            .withConverter(converters.channel),
          where('previewUserIds', 'array-contains', user.id)
        )
      )).forEach(channel => transaction.update(
        channel.ref,
        `previewUsers.${user.id}`, { avatar: user.avatar, name: user.name }
      ))
    }
    async function updateChats() {
      (await getDocs(
        query(
          collection(fs, 'chats')
            .withConverter(converters.chat),
          where('userIds', 'array-contains', user.id)
        )
      )).forEach(chat => transaction.update(
        chat.ref,
        `participants.${user.id}.name`, user.name
      ))
    }
    let userChanges = this.getUserChanges([this.userProfile()!, user]);
    if ('name' in userChanges) {
      await updateChannels()
      await updateChats()
    } else if ('avatar' in userChanges) {
      await updateChannels()
    }
    transaction.set(doc(this.firestore, 'users', user.id)
      .withConverter(converters.user),
      user,
      { merge: true }
    )
  }

  async updateUserSettings(user: UserData): Promise<void> {
    return await runTransaction(
      this.firestore,
      async (transaction) => this.processUserChange(user, transaction))
  }

  //Add or remove a user to a channel

  async addUserToChannel(user: UserData, channelId: string): Promise<void> {
    const db = this.firestore
    return await runTransaction(this.firestore, async function _addUserToChannel(transaction) {
      const channelDoc = await transaction.get(doc(db, 'channels', channelId).withConverter(converters.channel))
      debugger
      if (channelDoc.data()?.membersCount! < 3) {
        transaction.update(
          channelDoc.ref,
          'userIds', arrayUnion(user.id),
          'previewUserIds', arrayUnion(user.id),
          `previewUsers.${user.id}`, { avatar: user.avatar }
        )
      } else {
        transaction.update(
          channelDoc.ref,
          'userIds', arrayUnion(user.id)
        )
      }
      transaction.update(
        doc(db, 'users', user.id)
          .withConverter(converters.user),
        { 'channelIds': arrayUnion(channelId) }
      );
    })
  }

  async removeUserFromChannel(userId: string, channelId: string): Promise<void> {
    const db = this.firestore
    return await runTransaction(this.firestore, async function _removeUserFromChannel(transaction) {
      const channel = await transaction.get(doc(db, 'channels', channelId).withConverter(converters.channel))
      if (channel.exists() && channel.data().previewUserIds && channel.data().previewUserIds?.includes(userId)) {
        let otherUsers = channel.data().previewUserIds?.filter(id => id !== userId) || [];
        let newPreviewUserId = otherUsers[0];
        let newPreviewUser = await transaction.get(doc(db, 'users', newPreviewUserId).withConverter(converters.user));
        if (newPreviewUser.exists()) {
          transaction.update(
            channel.ref,
            'userIds', arrayRemove(userId),
            'previewUserIds', [...otherUsers, newPreviewUserId],
            `previewUsers.${userId}`, deleteField(),
            `previewUsers.${newPreviewUserId}`,
            { avatar: newPreviewUser.data().avatar }
          )
        } else {
          transaction.update(
            channel.ref,
            'userIds', arrayRemove(userId),
            'previewUserIds', [...otherUsers],
            `previewUsers.${userId}`, deleteField()
          )
        }
      } else {
        transaction.update(
          channel.ref,
          'userIds', arrayRemove(userId)
        )
      }
      transaction.update(
        doc(db, 'users', userId)
          .withConverter(converters.user),
        { 'channelIds': arrayRemove(channelId) }
      )
    })
  }

  //TODO createChannel, createChat, 

  //"Cloud Functions Section" END

  private provider = new GoogleAuthProvider();
  readonly user$ = user(this.auth).pipe(shareReplay());
  readonly userProfile = toSignal(this.user$.pipe(
    filter(user => user !== null),
    switchMap(
      user => docData(
        doc(this.firestore, 'users', user!.uid)
          .withConverter(converters.user)
      )
    )
  ), { initialValue: undefined })
  loggedInUser = computed(() => this.userProfile()?.authId || '')

  constructor(private router: Router) { }

  async registerWithEmailAndPassword(email: string, password: string, name: string) {
    try {
      let userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await this.setUpNewUser(userCredential.user.uid, name, email)
      return userCredential.user.uid
    } catch (error) {
      return 'error';
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password).then(
        () => {
          this.router.navigate(['/home']);
          return false;
        }
      );
    } catch (err) {
      return true;
    }
  }

  forgotPasswordEmail(email: string) {
    try {
      sendPasswordResetEmail(this.auth, email);
      return true;
    } catch {
      return false;
    }
  }

  async googleAuth() {
    signInWithPopup(this.auth, this.provider)
      .then(async (result) => {
        const userRef = await getDoc(doc(this.firestore, 'users', result.user.uid));
        if (userRef.exists()) {
          this.router.navigate(['home']);
        } else {
          await this.setUpNewUser(result.user.uid, result.user.displayName || '', result.user.email || '');
          this.router.navigate(['avatarPicker', result.user.uid]);
        }
      });
  }

  signOut() {
    signOut(this.auth)
  }



  async addDirectChat(recipient: string) {
    const docRef = await addDoc(collection(this.firestore, 'chats'), {
      users: [this.loggedInUser(), recipient],
    });
    let chatId = docRef.id;
    return chatId;
  }
}
