import { Component, input } from '@angular/core';
import { RecoverableDamages } from '../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { InsurtechRecoverableAccordionsComponent } from './insurtech-recoverable-accordions/insurtech-recoverable-accordions.component';
import { InsurtechPublicConditionsComponent } from './insurtech-public-conditions/insurtech-public-conditions.component';
import { InsurtechRecoverableComponent } from './insurtech-recoverable/insurtech-recoverable.component';

@Component({
  selector: 'app-insurtech-recoverable-damages',
  templateUrl: './insurtech-recoverable-damages.component.html',
  styleUrls: ['./insurtech-recoverable-damages.component.scss'],
  standalone: true,
  imports: [InsurtechRecoverableComponent, InsurtechPublicConditionsComponent, InsurtechRecoverableAccordionsComponent],
})
export class InsurtechRecoverableDamagesComponent {
  recoverableDamages = input.required<RecoverableDamages>();
}
