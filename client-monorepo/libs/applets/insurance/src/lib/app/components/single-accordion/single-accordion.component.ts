import { Component, input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { InsIconComponent } from '../../../features/vehicle/ui-components/ins-icon/ins-icon.component';
import { IconEnum } from '../../data-access/enums/icon.enum';

@Component({
  selector: 'single-accordion',
  standalone: true,
  imports: [
    InsIconComponent
  ],
  templateUrl: './single-accordion.component.html',
  styleUrl: './single-accordion.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('true', style({
        height: '0px',
        marginBottom: '0'
      })),
      state('false', style({
        height: '*',
        marginBottom: '20px'
      })),
      transition('true => false', animate('300ms linear')),
      transition('false => true', animate('300ms linear', style({
        height: '0px',
        marginBottom: '0'
      })))
    ]),
    trigger('rotateChevron', [
      state('true', style({
        transform: 'rotate(0deg)',
      })),
      state('false', style({
        transform: 'rotate(180deg)'
      })),
      transition('* <=> *', animate('300ms linear')),
    ])
  ]
})
export class SingleAccordionComponent {

  constructor() {
  }

  disabledAccordion = input<boolean>(false);

  protected readonly IconEnum = IconEnum;
  protected expanded = true;
}
