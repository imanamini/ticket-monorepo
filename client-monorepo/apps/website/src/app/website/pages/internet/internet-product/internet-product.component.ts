import { Component, Input } from '@angular/core';
import { InternetProductData } from '../../../../api/clients/models/templates/internet/internet-template-data';
import { InternetInitialComponent } from '../../../applets/service-internet/internet-initial/internet-initial.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-internet-product',
  templateUrl: './internet-product.component.html',
  styleUrls: ['./internet-product.component.scss'],
  standalone: true,
  imports: [NgIf, InternetInitialComponent, NgFor],
})
export class InternetProductComponent {
  @Input()
  internetProductData!: InternetProductData;

  providerHoverIndex: number;
}
