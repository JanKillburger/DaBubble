import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.class';
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
import { EMPTY, filter, first, map, shareReplay, switchMap, tap } from 'rxjs';
import converters from './firestore-converters';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirebaseChannelService } from './firebase-channel.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  firestore = inject(Firestore);
  auth = inject(Auth);

  //TODO remove or replace
  loading: boolean = false;
  allUsers: UserData[] = [];
  querySnapshot: any;
  user: User = new User();
  loggedInUserAuth = '';
  loggedInUser: string = '';
  authUserId: string = ''

  private provider = new GoogleAuthProvider();

  readonly user$ = user(this.auth).pipe(shareReplay())
  readonly userProfile = toSignal(this.user$.pipe(
    filter(user => user !== null),
    switchMap(
      user => collectionData(
        query(
          collection(this.firestore, 'users'),
          where('authId', '==', user!.uid)
        ).withConverter(converters.user)
      ).pipe(
        map(users => users[0])
      )
    )
  ), { initialValue: undefined })

  constructor(private router: Router) {
    //TODO move to other service for generally fetching data
    this.getData();
  }

  async registerWithEmailAndPassword(email: string, password: string, name: string) {
    try {
      let userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.authUserId = userCredential.user.uid;
      this.createUserProfile({ uid: userCredential.user.uid, email, displayName: name });
      this.addUserInOfficeChannel(userCredential.user.uid);
      this.addPersonalChat(userCredential.user.uid);
      return userCredential.user.uid
    } catch (error) {
      return 'error';
    }
  }

  createUserProfile(user: { uid: string, email: string | null, displayName: string | null, avatar?: string }) {
    const userRef = doc(this.firestore, 'users', user.uid);
    return setDoc(
      userRef,
      {
        authId: user.uid,
        userId: user.uid,
        online: true,
        email: user.email,
        name: user.displayName,
        avatar: user.avatar ?? './assets/img/login/SignIn/emptyProfile.png'
      })
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password).then(
        (userCredential) => {
          this.loggedInUser = userCredential.user.uid;
          this.router.navigate(['/home']);
          window.location.reload();
          return false;
        }
      );
    } catch (err) {
      return true;
    }
  }

  async saveUserService(userData: User): Promise<string> {
    this.loading = true;
    const userRef = doc(this.firestore, 'users', this.authUserId);
    return setDoc(userRef, userData.toJson()).then(() => {
      this.loading = false;
      return this.authUserId;
    }
    );
  }

  async getData() {
    this.allUsers = [];
    this.querySnapshot = await getDocs(collection(this.firestore, 'users'));
    this.querySnapshot.forEach((user: any) => {
      let userData: UserData = user.data();
      userData.userId = user.id;
      this.allUsers.push(userData as UserData);
    });
  }

  async updateUserService(editUser: any, editUserId: string): Promise<boolean> {
    this.loading = true;
    try {
      await updateDoc(
        this.getSingleRef(editUserId),
        JSON.parse(JSON.stringify(editUser))
      );
      return true;
    } catch (error) {
      console.error("Update User ERROR:", error);
      return false;
    } finally {
      this.loading = false;
    }
  }

  getSingleRef(UserId: string) {
    return doc(collection(this.firestore, 'users'), UserId);
  }

  async getUserData(UserId: string) {
    const docRef = this.getSingleRef(UserId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('Kein solches Dokument!');
      return null;
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

  // updateNewPasswordWithEmail(user: any, newPassword: string) {
  //   try {
  //     updatePassword(user, newPassword);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  searchingUser(searchTerm: any) {
    return this.allUsers.filter((users) =>
      users.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  async googleAuth() {
    signInWithPopup(this.auth, this.provider)
      .then(async (result) => {
        const userRef = await getDoc(doc(this.firestore, 'users', result.user.uid));
        if (userRef.exists()) {
          this.router.navigate(['home']);
        } else {
          this.createUserProfile({ uid: result.user.uid, email: result.user.email, displayName: result.user.displayName });
          this.addUserInOfficeChannel(result.user.uid);
          this.addPersonalChat(result.user.uid);
          this.router.navigate(['avatarPicker', result.user.uid]);
        }
      });
  }

  addUserInOfficeChannel(userId: any) {
    const channelDocRef = doc(
      this.firestore,
      'channels',
      'grDvJ7eyWqziuvoDsr41'
    );
    updateDoc(channelDocRef, {
      users: arrayUnion(userId),
    })
      .then(() => {
        console.log("Neuer Benutzer wurde zum 'users'-Array hinzugefügt");
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen eines neuen Benutzers:', error);
      });
  }

  async addPersonalChat(Userid: any) {
    const docRef = await addDoc(collection(this.firestore, 'chats'), {
      users: [Userid],
    });
  }

  signOut() {
    signOut(this.auth)
  }
}

interface UserData {
  name: string;
  email: string;
  authId: string;
  userId: string;
  avatar: string;
  online: boolean;
}
