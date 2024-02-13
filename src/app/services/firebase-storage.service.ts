import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  private userImgUrlSource = new BehaviorSubject<string>('');
  userImgUrl = this.userImgUrlSource.asObservable();
  firestore: Firestore = inject(Firestore);

  uploadImageInStorage(userId: string, file: any) {
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, 'gs://dabubble-ea6d8.appspot.com');
    const storageRef = ref(storage, userId);
    uploadBytes(storageRef, file).then(() => {
      console.log('Uploaded a blob or file!');
    });
  }

  async getImageFromStorage(userId: string) {
    const storage = getStorage();
    const starsRef = ref(storage, userId);
    getDownloadURL(starsRef)
      .then((url) => {
        this.updateUserImgUrl(url);
      })
      .catch((error) => {
        console.log('error');
        return 'error';
      });
  }

  updateUserImgUrl(newUrl: string) {
    this.userImgUrlSource.next(newUrl);
  }
}
