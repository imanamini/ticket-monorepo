import { Component, effect, input, signal } from '@angular/core';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { NgxBadgeModule } from '@digipay/ngx-badge';

import { InsDashedDividerComponent } from '../ins-dashed-divider/ins-dashed-divider.component';
import { SectionDetailCardModel } from '../../data-access/models/section-detail-card.model';
import {
  TitleValueContentComponent
} from '../title-value-content/title-value-content.component';
import { IconEnum } from '../../data-access/enums/icon.enum';
import { NgClass } from '@angular/common';
import { InsAlertComponent } from '../ins-alert/ins-alert.component';
import { InsIconComponent } from '../../features/vehicle/components/ins-icon/ins-icon.component';

@Component({
  selector: 'section-detail-card',
  standalone: true,
  imports: [
    InsIconComponent,
    NgxBadgeModule,
    TitleValueContentComponent,
    InsDashedDividerComponent,
    NgClass,
    InsAlertComponent
  ],
  templateUrl: './section-detail-card.component.html',
  styleUrl: './section-detail-card.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('true', style({
        height: '0px',
        marginTop: '0px'
      })),
      state('false', style({
        height: '*',
        marginTop: '20px'
      })),
      transition('true=>false', [
        group([
          query('@expandDetails', animateChild()),
          animate('300ms linear', style({
            height: '*',
            marginTop: '20px'
          })),
        ])
      ]),

      transition('false=>true', [
        group([
          query('@expandDetails', animateChild()),
          animate('300ms linear', style({
            height: '0px',
            marginTop: '0px'
          }))
        ])
      ])]),

    trigger('expandDetails', [
      state('true', style({
        padding: '0px 12px',
      })),
      state('false', style({
        padding: '8px 12px',
      })),
      transition('true=>false', [
        animate('300ms linear', style({
          padding: '8px 12px',
        })),
      ]),
      transition('false=>true', [
        animate('300ms linear', style({
          padding: '0px 12px',
        })),
      ])
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
export class SectionDetailCardComponent {
  constructor() {
    effect(() => {
      if (this.data().expandable) {
        this.expanded.set(this.data().expanded);
      }
    }, {allowSignalWrites: true});
  }

  data = input.required<SectionDetailCardModel>();
  protected readonly InsIconComponent = InsIconComponent;
  protected readonly IconEnum = IconEnum;
  expanded = signal<boolean>(null);

  handleExpandClicked(): void {
    this.expanded.set(!this.expanded());
  }
}
