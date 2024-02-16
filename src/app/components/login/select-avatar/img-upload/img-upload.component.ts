import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseStorageService } from '../../../../services/firebase-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-img-upload',
  standalone: true,
  imports: [],
  templateUrl: './img-upload.component.html',
  styleUrls: [
    './img-upload.component.scss',
    './mobileImg-upload.component.scss',
  ],
})
export class ImgUploadComponent {
  fileobj: any;
  userId: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private storage: FirebaseStorageService,
    private router: Router
  ) {
    this.userId = this.activeRoute.snapshot.paramMap.get('id') ?? '';
  }

  closeUploadDialog() {
    let updloadDialog = document.getElementById('updloadDialog');
    updloadDialog?.classList.add('display_none');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.handleFile(file);
      }
    }
  }

  handleFile(file: File) {
    let fileType = this.checkFileType(file.name);
    if (fileType === 'jpg' || fileType === 'png') {
      this.storage.uploadImageInStorage(this.userId, file);
      this.storage.getImageFromStorage(this.userId);
      this.reloadAvatarSelection();
    } else {
      console.log('Falscher Datentype');
    }
  }

  checkFileType(fileName: string) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  reloadAvatarSelection() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
