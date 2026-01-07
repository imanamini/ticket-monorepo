import { Component, input, signal } from '@angular/core';
import { RecoverableDamages } from '../../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { UiComplexAccordionComponent } from '../../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component';

@Component({
  selector: 'app-insurtech-recoverable-accordions',
  templateUrl: './insurtech-recoverable-accordions.component.html',
  styleUrls: ['./insurtech-recoverable-accordions.component.scss'],
  standalone: true,
  imports: [UiComplexAccordionComponent],
})
export class InsurtechRecoverableAccordionsComponent {
  recoverableDamages = input<RecoverableDamages>();
  activeAccordion = signal(0);

  setActiveAccordion(accordionIndex: number) {
    this.activeAccordion.set(accordionIndex === this.activeAccordion() ? -1 : accordionIndex);
  }
}
