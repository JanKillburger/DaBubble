import { ElementRef, Injectable } from '@angular/core';
import { PositionDetails } from '../models/position-details.model';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  constructor() { }

  getElementBounds(el: ElementRef) {
    return el.nativeElement.getBoundingClientRect();
  }

  getPositionRelativeTo(el: ElementRef, verticalRef: "top" | "bottom", horizontalRef: "left" | "right") {
    const bounds = this.getElementBounds(el);
    let positionDetails: PositionDetails = {};
    verticalRef == "top" ? positionDetails["bottom"] = window.innerHeight - bounds.top + "px" : positionDetails["top"] = bounds.bottom + "px";
    horizontalRef == "left" ? positionDetails["left"] = bounds.left + "px" : positionDetails["right"] = window.innerWidth - bounds.right + "px";
    return positionDetails;
  }
}
