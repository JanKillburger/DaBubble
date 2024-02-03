import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExampleDialogComponent } from '../example-dialog/example-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatDialogModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  screenMode: "small" | "medium" | "large" = "large";
  navVisible = true;
  threadVisible = true;
  threadVisibleMq = true;
  channelVisible = true;
  mqlMaxWidth: MediaQueryList;
  mqlMediumWidth: MediaQueryList;
  @ViewChild('dialogTrigger') dialogTrigger!: ElementRef;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog) {
    this.mqlMaxWidth = media.matchMedia('(min-width: 1440px)');
    this.mqlMaxWidth.onchange = (event) => {
      if (event.matches) {
        this.navVisible = true;
      }
      changeDetectorRef.detectChanges();
    };
    this.mqlMediumWidth = media.matchMedia('(min-width: 992px)');
    this.threadVisibleMq = this.mqlMediumWidth.matches;
    this.mqlMediumWidth.onchange = (event) => {
      console.log(event.matches);
      if (event.matches) {
        this.screenMode = "large";
        this.channelVisible = true;
        this.threadVisibleMq = true;
      } else {
        this.screenMode = "medium";
        this.channelVisible = true;
        this.threadVisibleMq = false;
      }
      changeDetectorRef.detectChanges();
    }
  }
  toggleNav() {
    this.navVisible = !this.navVisible;
  }

  closeThread() {
    this.threadVisible = false;
    this.channelVisible = true;
  }

  openThread() {
    this.threadVisibleMq = true;
    this.threadVisible = true;
    if (this.screenMode == "medium") {
      this.channelVisible = false;
    }
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.removeAttribute("style");
    }, 500);
  }

  openDialog() {
    const bounds = this.dialogTrigger.nativeElement.getBoundingClientRect();
    this.dialog.open(ExampleDialogComponent, { position: { top: bounds.bottom + "px", left: bounds.left + "px" } })
  }
}
