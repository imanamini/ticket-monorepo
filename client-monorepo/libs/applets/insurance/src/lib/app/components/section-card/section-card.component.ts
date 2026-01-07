import { Component, input } from '@angular/core';

import { SectionDetailCardComponent } from '../section-detail-card/section-detail-card.component';
import { SectionCardModel } from '../../data-access/models/section-card.model';

@Component({
  selector: 'section-card',
  standalone: true,
  imports: [
    SectionDetailCardComponent
  ],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss'
})
export class SectionCardComponent {
  data = input.required<SectionCardModel>();
}
