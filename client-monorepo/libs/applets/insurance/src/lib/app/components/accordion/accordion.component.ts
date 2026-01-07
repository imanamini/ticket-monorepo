import { Component, input } from '@angular/core';
import { IconEnum } from '../../data-access/enums/icon.enum';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AccordionModel } from '../../data-access/models/accordion.model';
import { NgClass } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsIconComponent } from '../../features/vehicle/components/ins-icon/ins-icon.component';

@Component({
  selector: 'accordion',
  standalone: true,
  imports: [
    InsIconComponent,
    NgClass,
    NgxIcon
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('false', style({
        height: '0px',
      })),
      state('true', style({
        height: '*',
        overflow: '*'
      })),
      transition('false => true', animate('300ms linear')),
      transition('true => false', animate('300ms linear', style({
        height: '0px',
      })))
    ]),
    trigger('rotateChevron', [
      state('false', style({
        transform: 'translate(-50%, -50%) rotate(-90deg)',
      })),
      state('true', style({
        transform: 'translate(-50%, -50%) rotate(0deg)'
      })),
      transition('* <=> *', animate('200ms linear')),
    ])
  ]
})
export class AccordionComponent {
  public accordionItems = input.required<Array<AccordionModel>>();
  protected accordionSelected = -1;
  protected readonly IconEnum = IconEnum;

  protected toggleAccordion(id: number): void {
    this.accordionSelected = this.accordionSelected === id ? -1 : id;
  }
}
