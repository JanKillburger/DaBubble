import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-messages-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    PickerModule,
    NgIf,
  ],
  templateUrl: './messages-input.component.html',
  styleUrl: './messages-input.component.scss',
})
export class MessagesInputComponent {
  showEmojiPicker = false;
  message = '';
  userToPick: boolean = false;
  messageForm: FormGroup = new FormGroup({});
  pickUser = new FormControl('');
  userList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    console.log(this.message);
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`);
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    // this.showEmojiPicker = false;
  }

  showUser(select: MatSelect): void {
    select.open(); // Öffnet die mat-select-Komponente
  }
}
