import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { log } from 'console';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  navVisible = true;
  threadVisible = true;
  mdq: MediaQueryList;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mdq = media.matchMedia('(min-width: 1440px)');
    this.mdq.onchange = (event) => {
      changeDetectorRef.detectChanges();
      if (event.matches) {
        this.navVisible = true;
      }
    }
  }
  toggleNav() {
    this.navVisible = !this.navVisible;
  }

  closeThread() {
    this.threadVisible = false;
  }

  openThread() {
    this.threadVisible = true;
  }
}
