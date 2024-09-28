import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  private userImgUrlSource = new BehaviorSubject<string>('');
  userImgUrl = this.userImgUrlSource.asObservable();
  fileUrl: string = '';
  firestore: Firestore = inject(Firestore);

  async uploadImageInStorage(fileNam: string, file: any) {
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, 'gs://dabubble-ea6d8.appspot.com');
    const storageRef = ref(storage, fileNam);
    try {
      await uploadBytes(storageRef, file);
      return true;
    } catch {
      return false;
    }
  }

  async getImageFromStorage(userId: string) {
    const storage = getStorage();
    const starsRef = ref(storage, userId);
    getDownloadURL(starsRef)
      .then((url) => {
        this.updateUserImgUrl(url);
      })
      .catch((error) => {
        return 'error';
      });
  }

  getImgLink(ref: StorageReference) {
    return getDownloadURL(ref);
  }

  saveUserAvatar(fileName: string, file: File) {
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, 'gs://dabubble-ea6d8.appspot.com');
    const storageRef = ref(storage, fileName);
    return uploadBytes(storageRef, file);
  }

  updateUserImgUrl(newUrl: string) {
    this.userImgUrlSource.next(newUrl);
  }

  async getFileFromStorage(filename: string) {
    const storage = getStorage();
    const starsRef = ref(storage, filename);
    await getDownloadURL(starsRef).then((url) => {
      this.fileUrl = url;
    });
  }
}
