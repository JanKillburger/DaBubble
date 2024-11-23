import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {

  fs = inject(Firestore);
  storage = getStorage();

  private userImgUrlSource = new BehaviorSubject<string>('');
  userImgUrl = this.userImgUrlSource.asObservable();
  fileUrl: string = '';

  async uploadImageInStorage(fileName: string, file: any): Promise<boolean> {
    const storageRef = ref(this.storage, fileName);
    try {
      await uploadBytes(storageRef, file);
      return true;
    }
    catch {
      return false;
    }
  }

  async getImageFromStorage(userId: string) {
    const starsRef = ref(this.storage, userId);
    getDownloadURL(starsRef)
      .then((url) => {
        this.updateUserImgUrl(url);
      })
      .catch(() => {
        return 'error';
      });
  }

  getImgLink(ref: StorageReference) {
    return getDownloadURL(ref);
  }

  saveUserAvatar(fileName: string, file: File) {
    const storageRef = ref(this.storage, fileName);
    return uploadBytes(storageRef, file);
  }

  updateUserImgUrl(newUrl: string) {
    this.userImgUrlSource.next(newUrl);
  }

  async getFileFromStorage(filename: string) {
    const starsRef = ref(this.storage, filename);
    await getDownloadURL(starsRef).then((url) => {
      this.fileUrl = url;
    });
  }
}
