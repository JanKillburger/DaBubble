import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUserService {
  firestore: Firestore = inject(Firestore);
  allUsers: UserData[] = [];

  async getUserData() {
    this.allUsers = [];
    let querySnapshot = await getDocs(collection(this.firestore, 'users'));
    querySnapshot.forEach((user: any) => {
      let userData: UserData = user.data();
      userData.userId = user.id;
      this.allUsers.push(userData as UserData);
    });
  }
}

export interface UserData {
  name: string;
  email: string;
  authId: string
  userId: string;
  avatar: string;
  online: boolean;
}