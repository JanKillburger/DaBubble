import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export class informationAnimation {
  static userInformation = trigger('slideInOutAnimation', [
    state('in', style({ transform: 'translateX(0)' })),
    transition(':enter', [
      style({ transform: 'translateX(calc(100% + 60px))' }),
      animate('0.5s ease-in-out'),
    ]),
    transition(':leave', [
        animate('0.5s ease-in-out', style({ transform: 'translateX(calc(100% + 60px))' })),
      ]),
  ]);
}
