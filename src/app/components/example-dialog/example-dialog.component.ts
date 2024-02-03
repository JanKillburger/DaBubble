import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-example-dialog',
  standalone: true,
  imports: [],
  templateUrl: './example-dialog.component.html',
  styleUrl: './example-dialog.component.scss'
})
export class ExampleDialogComponent {
constructor(public dialogRef: MatDialogRef<ExampleDialogComponent>) {}
}
