import {
  trigger,
  state,
  style,
  animate,
  transition,
  sequence,
  query,
  group,
} from '@angular/animations';

export class startAnimations {
  static slideInOutAnimation = trigger('slideInOutAnimation', [
    state('in', style({ transform: 'translateX(0)' })),
    transition(':enter', [
      style({ transform: 'translateX(calc(100% + 60px))' }),
      animate('0.5s ease-in-out'),
    ]),
  ]);

  static landingPageAnimationDesktop = trigger('landingPageAnimationDesktop', [
    transition(
      ':enter',
      sequence([
        group([
          query('.logo-wrapper', [
            animate(
              '500ms ease-in-out',
              style({
                left: 'calc(50% - (180px + 16px))',
              })
            ),
          ]),
          query('.logo-mask', [
            animate(
              '500ms ease-in-out',
              style({
                left: 'calc(50% - (180px + 16px))',
              })
            ),
          ]),
        ]),
        query('.logo-wrapper span', [
          animate('500ms ease-in-out', style({ left: ' calc(180px + 16px)' })),
        ]),
        animate('500ms', style({})),
        group([
          query('.logo-mask', [
            animate(
              '0ms ease-in-out',
              style({
                opacity: '0',
              })
            ),
          ]),
          query('.logo-wrapper', [
            animate(
              '1000ms ease-in-out',
              style({
                left: ' 55px',
                top: '30px',
                height: 'calc(128px - 45px)',
              })
            ),
          ]),
          query('.logo-wrapper span', [
            animate(
              '1000ms ease-in-out',
              style({
                color: 'black',
                fontSize: '26px',
                top: '15px',
                left: 'calc(70px + 16px)',
              })
            ),
          ]),
          query('.logo-wrapper img', [
            animate(
              '500ms ease-in-out',
              style({ height: '75px', width: '75px' })
            ),
          ]),
          query('.background', [
            animate('500ms ease-in-out', style({ opacity: '0' })),
          ]),
        ]),
      ])
    ),
  ]);

  static landingPageAnimationMobile = trigger('landingPageAnimationMobile', [
    transition(
      ':enter',
      sequence([
        group([
          query('.mobile-logo-wrapper', [
            animate(
              '500ms ease-in-out',
              style({
                left: 'calc(40% - 40px)',
              })
            ),
          ]),
          query('.mobile-logo-mask', [
            animate(
              '500ms ease-in-out',
              style({
                left: 'calc(40% - 76px)',
              })
            ),
          ]),
        ]),
        query('.mobile-logo-wrapper span', [
          animate('500ms ease-in-out', style({ left: '85px' })),
        ]),
        animate('500ms', style({})),
        group([
          query('.mobile-logo-mask', [
            animate(
              '1ms ease-in-out',
              style({
                opacity: '0',
              })
            ),
          ]),
          query('.mobile-logo-wrapper', [
            animate(
              '1000ms ease-in-out',
              style({
                top: '30px',
              })
            ),
          ]),
          query('.mobile-logo-wrapper span', [
            animate(
              '1000ms ease-in-out',
              style({
                top: '16px',
                left: '85px',
                color: 'black',
                fontSize: '26px',
              })
            ),
          ]),
          query('.mobile-background', [
            animate('1000ms ease-in-out', style({ opacity: '0' })),
          ]),
        ]),
      ])
    ),
  ]);
}