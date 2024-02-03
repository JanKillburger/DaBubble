import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExampleDialogComponent } from '../example-dialog/example-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  navVisible = true;
  threadVisible = true;
  mdq: MediaQueryList;
  @ViewChild('dialogTrigger') dialogTrigger!: ElementRef;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog) {
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
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.removeAttribute("style");
    }, 500);
  }

  openDialog() {
    const bounds = this.dialogTrigger.nativeElement.getBoundingClientRect();
    console.log(bounds);
    this.dialog.open(ExampleDialogComponent, { position: { top: bounds.bottom + "px", left: bounds.left + "px" } })
  }
}
