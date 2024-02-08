import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'; 

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
}
