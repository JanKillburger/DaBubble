import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { ViewportService } from '../../services/viewport.service';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { ChannelComponent } from '../channel/channel.component';
import { ThreadComponent } from '../thread/thread.component';
import { MatIconModule } from '@angular/material/icon';
import { MAX_INLINE_WIDTH, MEDIUM_LARGE_WIDTH, SMALL_MEDIUM_WIDTH } from '../../../global-constants';
import { CreateChannelComponent } from './create-channel/create-channel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NavMenuComponent, ChannelComponent, ThreadComponent, MatDialogModule, NgIf, NgClass, CreateChannelComponent],
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
  @ViewChild('triggerUserDialog') triggerUserDialog!: ElementRef;

  constructor(public changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog, public viewport: ViewportService) {
    this.mqlSmallWidth = media.matchMedia(`(min-width: ${SMALL_MEDIUM_WIDTH})`);
    this.mqlSmallWidth.onchange = (event) => this.handleSmallWidthChange(event);
    this.mqlMediumWidth = media.matchMedia(`(min-width: ${MEDIUM_LARGE_WIDTH})`);
    this.mqlMediumWidth.onchange = (event) => this.handleMediumWidthChange(event);
    this.mqlMaxWidth = media.matchMedia(`(min-width: ${MAX_INLINE_WIDTH})`);
    this.mqlMaxWidth.onchange = (event) => {
      if (event.matches) {
        this.navVisible = true;
      }
      changeDetectorRef.detectChanges();
    };
    this.initContainers();
  }

  initContainers() {
    if (!this.mqlSmallWidth.matches) {
      this.screenMode = "small";
      this.channelVisible = false;
    }
    else if (!this.mqlMediumWidth.matches) {
      this.screenMode = "medium";
      this.threadVisibleMq = false;
      this.channelVisible = true;
    } else {
      this.screenMode = "large";
      this.threadVisibleMq = true;
      this.channelVisible = true;
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
      if (this.navVisible) {
        this.channelVisible = false;
        this.threadVisibleMq = false;
      }
    } else {
      this.screenMode = "medium";
      if (this.navVisible) {
        this.channelVisible = true;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  toggleNav() {
    if (this.screenMode == "small") {
      this.channelVisible = false;
      this.threadVisibleMq = false;
    }
    this.navVisible = !this.navVisible;
    this.changeDetectorRef.detectChanges();
  }

  closeThread() {
    if (this.screenMode != "large") {
      this.threadVisibleMq = false;
    }
    this.threadVisible = false;
    this.channelVisible = true;
    this.changeDetectorRef.detectChanges();
  }

  openThread() {
    this.threadVisibleMq = true;
    this.threadVisible = true;
    if (this.screenMode != "large") {
      this.channelVisible = false;
    }
    this.changeDetectorRef.detectChanges();
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.removeAttribute("style");
    }, 500);
  }

  openChannel() {
    this.navVisible = false;
    this.channelVisible = true;
  }

  openDialog() {
    const positionDetails = this.viewport.getPositionRelativeTo(this.dialogTrigger, "top", "left");
    this.dialog.open(UserDialogComponent, { position: positionDetails });
  }

  openUserDialog() {
    const positionDetails = this.viewport.getPositionRelativeTo(this.triggerUserDialog, "bottom", "right");
    this.dialog.open(UserDialogComponent, { panelClass: 'custom-container', position: positionDetails });
  }
}
