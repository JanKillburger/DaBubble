import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.class';
import {
  sendPasswordResetEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  loading: boolean = false;
  allUsers: UserData[] = [];
  querySnapshot: any;
  user: User = new User();
  provider = new GoogleAuthProvider();
  loggedInUserAuth = ''
  loggedInUser = ''

  constructor(private router: Router) {
    this.getData()
  }

  async registerWithEmailAndPassword(email: string, password: string) {
    try {
      let userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user.uid;
    } catch (err) {
      console.error(err);
      return 'error';
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password).then(
        (userCredential) => {
          this.loggedInUserAuth = userCredential.user.uid;
          this.getLoggedInUserId()
          this.router.navigate(['/home']);
          return false;
        }
      );
    } catch (err) {
      console.log('that user does not exist', err);
      return true;
    }
  }

  async saveUserService(userData: User): Promise<string> {
    this.loading = true;
    return addDoc(collection(this.firestore, 'users'), userData.toJson()).then(
      (docRef) => {
        this.loading = false;
        return docRef.id;
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
      console.error(error);
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

  updateNewPasswordWithEmail(user: any, newPassword: string) {
    try {
      updatePassword(user, newPassword);
      return true;
    } catch {
      return false;
    }
  }

  async googleAuth() {
    return signInWithPopup(this.auth, this.provider).then((result) => {
      let createdAt = result.user.metadata.creationTime ?? '';
      this.user.name = result.user.displayName ?? '';
      this.user.email = result.user.email ?? '';
      this.user.authId = result.user.uid ?? '';
      if (this.googleUserCheck(createdAt)) {
        let docIdPromise = this.saveUserService(this.user);
        docIdPromise.then((docId) => {
          this.router.navigate([`avatarPicker/${docId}`]);
        });
      } else {
        this.router.navigate(['home']);
      }
    });
  }

  googleUserCheck(createdAt: string) {
    let newUser = false;
    let dateToCheck = new Date(createdAt);
    let now = new Date();
    let differenceInMilliseconds = now.getTime() - dateToCheck.getTime();
    let differenceInMinutes = differenceInMilliseconds / 1000 / 15;
    if (differenceInMinutes < 1) {
      return (newUser = true);
    } else {
      return (newUser = false);
    }
  }

  userSingOut(){
    signOut(this.auth).then(() => {
      console.log('Sign-out successful')
    }).catch((error) => {
      console.log('An error happened')
    });
  }

  getLoggedInUserId(){
    this.allUsers.forEach((user) => {
      if (user.authId === this.loggedInUserAuth){
        this.loggedInUser = user.userId
        console.log(user.authId)
        console.log(this.loggedInUserAuth)
        console.log(user.userId)
    }})
  }
}

interface UserData {
  name: string;
  email: string;
  authId: string
  userId: string;
  avatar: string;
  online: boolean;
}
