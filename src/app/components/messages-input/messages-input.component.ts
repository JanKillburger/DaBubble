import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-messages-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './messages-input.component.html',
  styleUrl: './messages-input.component.scss',
})
export class MessagesInputComponent {
  messageForm: FormGroup = new FormGroup({
})}
