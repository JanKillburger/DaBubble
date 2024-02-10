import { Component } from '@angular/core';

@Component({
  selector: 'app-img-upload',
  standalone: true,
  imports: [],
  templateUrl: './img-upload.component.html',
  styleUrl: './img-upload.component.scss',
})
export class ImgUploadComponent {
  fileobj: any;

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
    // Optional: Visual Feedback, z.B. Hervorhebung der Drop-Zone
  }
  
  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    // Optional: Entfernen des Visual Feedbacks
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
    // Verarbeiten Sie hier das Bild
    // Zum Beispiel: Lesen Sie die Datei als Data URL
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Hier können Sie event.target.result verwenden, um das Bild anzuzeigen
    };
    reader.readAsDataURL(file);
  }
}
