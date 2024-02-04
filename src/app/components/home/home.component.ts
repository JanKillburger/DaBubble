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
  threadVisibleMq!: boolean;
  channelVisible!: boolean;
  mqlMaxWidth: MediaQueryList;
  mqlMediumWidth: MediaQueryList;
  mqlSmallWidth: MediaQueryList;
  @ViewChild('dialogTrigger') dialogTrigger!: ElementRef;

  constructor(public changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog) {
    this.mqlSmallWidth = media.matchMedia('(min-width: 600px)');
    this.mqlSmallWidth.addEventListener("change", (event) => this.handleSmallWidthChange(event));
    this.mqlMediumWidth = media.matchMedia('(min-width: 992px)');
    this.mqlMediumWidth.addEventListener("change", (event) => this.handleMediumWidthChange(event));
    this.mqlMaxWidth = media.matchMedia('(min-width: 1440px)');
    this.mqlMaxWidth.onchange = (event) => {
      if (event.matches) {
        this.navVisible = true;
      }
      changeDetectorRef.detectChanges();
    };
    this.initContainers();
  }

  initContainers() {
    if (!this.mqlMediumWidth.matches) {
      this.screenMode = "medium";
      this.threadVisibleMq = false;
      this.channelVisible = true;
    } else {
      this.screenMode = "large";
      this.threadVisibleMq = true;
      this.channelVisible = true;
    }
    if (!this.mqlSmallWidth.matches) {
      this.screenMode = "small";
      this.channelVisible = false;
    }
  }

  handleMediumWidthChange(event: MediaQueryListEvent) {
    if (event.matches) {
      this.screenMode = "large";
      this.channelVisible = true;
      this.threadVisibleMq = true;
    } else {
      this.screenMode = "medium";
      this.channelVisible = true;
      this.threadVisibleMq = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  handleSmallWidthChange(event: MediaQueryListEvent) {
    if (!event.matches) {
      this.screenMode = "small";
      this.channelVisible = false;
      this.threadVisibleMq = false;
    } else {
      this.screenMode = "medium";
      this.channelVisible = true;
      this.threadVisibleMq = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  toggleNav() {
    this.navVisible = !this.navVisible;
  }

  closeThread() {
    if (this.screenMode != "large") {
      this.threadVisibleMq = false;
    }
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
