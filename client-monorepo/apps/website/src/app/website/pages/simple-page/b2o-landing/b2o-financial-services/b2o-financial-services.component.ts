import { Component, Input, OnInit } from '@angular/core';
import { financialServices } from '../B2O-landing.response';
import { B2oFinancialiItemComponent } from './b2o-financiali-item/b2o-financiali-item.component';

@Component({
  selector: 'app-b2o-financial-services',
  standalone: true,
  templateUrl: './b2o-financial-services.component.html',
  imports: [B2oFinancialiItemComponent],
  styleUrls: ['./b2o-financial-services.component.scss'],
})
export class B2oFinancialServicesComponent implements OnInit {
  @Input() services: financialServices;
  constructor() {}

  ngOnInit(): void {}
}
