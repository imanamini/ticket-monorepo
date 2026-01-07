import { Component } from '@angular/core';
import { SERVICE_TYPE } from '../../../../../data-access/models/credit/service-type/service-type.model';
import { CreditStoreBottomSheetComponent } from '../../../../../pre-registration/components/credit-store-bottom-sheet/credit-store-bottom-sheet.component';

@Component({
  selector: 'ui-landing-element-stores',
  templateUrl: './landing-element-stores.component.html',
  standalone: true,
  styleUrls: ['./landing-element-stores.component.scss'],
  imports: [CreditStoreBottomSheetComponent, CreditStoreBottomSheetComponent],
})
export class LandingElementStoresComponent {
  page = 0;
  pageSize = 24;
  protected readonly SERVICE_TYPE = SERVICE_TYPE;
}
