import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-img-upload',
  standalone: true,
  imports: [],
  templateUrl: './img-upload.component.html',
  styleUrl: './img-upload.component.scss',
})
export class ImgUploadComponent implements OnInit {
  fileobj: any

  ngOnInit(): void{
    // let dropArea = document.getElementById('drag-area');
    // if (dropArea) {
    //   dropArea.addEventListener('dragover', (event) => {
    //     event.preventDefault();
    //     dropArea?.classList.add('drag-area-active');
    //   });
  
    //   dropArea.addEventListener('dragleave', () => {
    //     dropArea?.classList.remove('drag-area-active');
    //   }); 
    // }
  }

  closeUploadDialog() {
    let updloadDialog = document.getElementById('updloadDialog')
    updloadDialog?.classList.add('display_none')
  }

  upload_file(e:any) {
    e.preventDefault();
    this.fileobj = e.dataTransfer.files[0];
    console.log(this.fileobj)
    // js_file_upload(fileobj);
}
}
