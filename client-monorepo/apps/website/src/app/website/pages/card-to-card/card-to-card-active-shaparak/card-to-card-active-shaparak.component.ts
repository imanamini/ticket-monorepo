import { Component, Input } from '@angular/core';
import { UiComplexAccordion } from '../../../../ui/ui-components/ui-complex-accordion/model/ui-complex-accordion';
import { UiComplexAccordionComponent } from '../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-card-to-card-active-shaparak',
  templateUrl: './card-to-card-active-shaparak.component.html',
  styleUrls: ['./card-to-card-active-shaparak.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiComplexAccordionComponent],
})
export class CardToCardActiveShaparakComponent {
  activeAccordion = -1;
  @Input()
  title = '';

  @Input()
  accordionsData: UiComplexAccordion[];

  selectAccordion(index: number): void {
    this.activeAccordion = index == this.activeAccordion ? -1 : index;
  }
}
