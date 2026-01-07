import { Component, Input } from '@angular/core';
import { OwnershipOther } from '../../../../../api/clients/models/templates/insurtech-activation/insurtech-activation-template-data';
import { UiComplexAccordionComponent } from '../../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-insurtech-ownership-other',
  templateUrl: './insurtech-ownership-other.component.html',
  styleUrls: ['./insurtech-ownership-other.component.scss'],
  standalone: true,
  imports: [NgIf, UiComplexAccordionComponent],
})
export class InsurtechOwnershipOtherComponent {
  @Input()
  ownershipOther: OwnershipOther;

  activeAccordion = 0;

  setActiveAccordion(accordionIndex: number) {
    this.activeAccordion = accordionIndex == this.activeAccordion ? -1 : accordionIndex;
  }
}
