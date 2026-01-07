import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const RouterAnimation = [
  trigger('routeAnimations', [
    transition(
      'home => hub, home => stores, home => transactions, home => profile, hub => stores,stores => transactions, transactions => profile, hub => transactions, hub => profile, stores => profile',
      [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [style({ left: '-100%' })], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '100%' }))], { optional: true }),
          query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], { optional: true }),
        ]),
      ],
    ),
    transition(
      'hub => home, stores => home, transactions => home, profile => home, stores => hub,transactions => stores, profile => transactions, transactions => hub, profile => hub, profile => stores',
      [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [style({ left: '+100%' })], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [animate('200ms ease-out', style({ left: '-100%' }))], { optional: true }),
          query(':enter', [animate('200ms ease-out', style({ left: '0%' }))], { optional: true }),
        ]),
      ],
    ),
    transition('service <=> *', [
      // Initial state
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            opacity: 0,
            scale: 0.8,
          }),
        ],
        { optional: true },
      ),
      // Animate the entering component
      query(':enter', [animate('300ms ease-in', style({ opacity: 1, scale: 1 }))], { optional: true }),
      // Animate the leaving component
      query(':leave', [animate('300ms ease-out', style({ opacity: 0, scale: 0.8 }))], { optional: true }),
    ]),
  ]),
];
