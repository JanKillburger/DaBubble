import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { UserData } from '../models/app.model';

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

   async updateUserProfile(user: UserData) {
    const docRef = doc(this.firestore, "users", user.authId);
    const res = await updateDoc(docRef, {"name": user.name, "email": user.email, "avatar": user.avatar});
   }
}
