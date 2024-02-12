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
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User is valid!');
      this.router.navigate(['/home']);
    } catch (err) {
      console.log('that user does not exist');
      // throw err;
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

  async updateUserService(editUser: any, editUserId: string) {
    this.loading = true;
    await updateDoc(
      this.getSingleRef(editUserId),
      JSON.parse(JSON.stringify(editUser))
    ).then(() => {
      this.loading = false;
    });
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
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('Hat geklappt. Wir sende dir eine Mail');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  updateNewPasswordWithEmail(user: any, newPassword: string) {
    updatePassword(user, newPassword)
      .then(() => {
        console.log('Passwort wurde geändert!');
      })
      .catch((error) => {
        console.log('Passwort wurde geändert!', error);
      });
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
    let newUser = false
    let dateToCheck = new Date(createdAt);
    let now = new Date();
    let differenceInMilliseconds = now.getTime() - dateToCheck.getTime();
    let differenceInMinutes = differenceInMilliseconds / 1000 / 60;
    if (differenceInMinutes < 1) {
      return newUser = true
    } else {
      return newUser = false
    }
  }
}

interface UserData {
  name: string;
  email: string;
  userId: string;
  avatar: string;
}
