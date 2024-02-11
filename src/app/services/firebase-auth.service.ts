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
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.class';

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
    return addDoc(collection(this.firestore, 'users'), userData.toJson()).then((docRef) => {
      this.loading = false;
      return docRef.id;
    });
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
      console.log("Keine solchen Dokument!");
      return null;
    }
  }
}

interface UserData {
  name: string;
  email: string;
  userId: string;
  avatar: string;
}
