import {trigger, style, animate, transition, sequence, query, group} from '@angular/animations';

export class startAnimations {

  static landingPageAnimationDesktop = trigger('landingPageAnimationDesktop', [
    transition(
      ':enter',
      sequence([
        // logo to left side
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
          animate('1000ms ease-in-out', style({ left: ' calc(180px + 16px)' })),
        ]),
        group([
          query('.logo-mask', [
            animate(
              '1ms ease-in-out',
              style({
                opacity: '0',
              })
            ),
          ]),

          // 
          query('.logo-wrapper', [
            animate(
              '1000ms ease-in-out',
              style({
                left: '75px',
                top: '32px',
                height: 'calc(128px - 50px)',
              })
            ),
          ]),
          query('.logo-wrapper span', [
            animate(
              '1000ms ease-in-out',
              style({
                color: 'black',
                'font-size': '32px',
                left: 'calc(75px + 16px)',
                'padding-top': '16px'
              })
            ),
          ]),
          query('.logo-wrapper img', [
            animate(
              '1000ms ease-in-out',
              style({ height: '70px', width: '70px' })
            ),
          ]),
          query('.background', [
            animate('1000ms ease-in-out', style({ opacity: '0' })),
          ]),
        ]),
      ])
    ),
  ]);
}
