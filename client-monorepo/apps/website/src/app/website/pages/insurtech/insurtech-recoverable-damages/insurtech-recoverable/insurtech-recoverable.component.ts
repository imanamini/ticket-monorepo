import { Component, input } from '@angular/core';
import { RecoverableDamages } from '../../../../../api/clients/models/templates/insurtech/insurtech-template-data';

@Component({
  selector: 'app-insurtech-recoverable',
  templateUrl: './insurtech-recoverable.component.html',
  styleUrls: ['./insurtech-recoverable.component.scss'],
  standalone: true,
})
export class InsurtechRecoverableComponent {
  recoverableDamages = input.required<RecoverableDamages>();
}
