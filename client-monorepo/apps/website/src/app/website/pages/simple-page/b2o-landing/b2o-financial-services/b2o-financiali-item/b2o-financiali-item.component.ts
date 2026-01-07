import { Component, Input } from '@angular/core';
import { financialServicesList } from '../../B2O-landing.response';

@Component({
  selector: 'app-b2o-financiali-item',
  standalone: true,
  templateUrl: './b2o-financiali-item.component.html',
  styleUrls: ['./b2o-financiali-item.component.scss'],
})
export class B2oFinancialiItemComponent {
  @Input() item!: financialServicesList;
}
