import { Injectable, computed, inject } from '@angular/core';
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
import { filter, map, shareReplay, switchMap } from 'rxjs';
import converters from './firestore-converters';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  firestore = inject(Firestore);
  auth = inject(Auth);

  //TODO remove or replace
  loading: boolean = false;
  allUsers: UserData[] = [];

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
  loggedInUser = computed(() => this.userProfile()?.userId || '')

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
          this.router.navigate(['/home']);
          //window.location.reload();
          return false;
        }
      );
    } catch (err) {
      return true;
    }
  }

  //TODO remove or replace
  async getData() {
    this.allUsers = [];
    const usersRef = await getDocs(collection(this.firestore, 'users'));
    usersRef.forEach((user: any) => {
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

  //TODO remove or replace
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
