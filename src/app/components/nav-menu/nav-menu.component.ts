import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
  @Input() navVisible!: boolean;
  @Output() toggleNavEvent = new EventEmitter<void>();

  toggleNav(): void {
    this.toggleNavEvent.emit();
  }
}
