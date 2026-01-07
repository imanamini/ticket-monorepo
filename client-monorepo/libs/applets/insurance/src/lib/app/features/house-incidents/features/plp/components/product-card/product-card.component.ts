import { Component, input, output } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { HouseIncidentProductCardModel } from '../../data-access/models/house-incident-product-card.model';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { InsIconComponent } from '../../../../../vehicle/components/ins-icon/ins-icon.component';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [
    PipesModule,
    InsButtonComponent,
    InsIconComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  productCardDetail = input<HouseIncidentProductCardModel>();
  onCoverageDetailButtonClick = output<HouseIncidentProductCardModel>();
  onOrderProductClick = output<HouseIncidentProductCardModel>();

  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
}
