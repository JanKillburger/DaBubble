import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

  constructor(private router: Router) {}

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
    let wrongLogIn;
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User is valid!');
      this.router.navigate(['/home']);
      return (wrongLogIn = false);
    } catch (err) {
      console.log('that user does not exist');
      return (wrongLogIn = true);
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
      this.user.userId = result.user.uid ?? '';
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
}

interface UserData {
  name: string;
  email: string;
  userId: string;
  avatar: string;
}
