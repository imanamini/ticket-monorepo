import { Component, HostBinding, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UsedStepsListComponent } from '../used-steps-list/used-steps-list.component';
import { UsedStepsListModel } from '../used-steps-list/models/used-steps-list.model';

@Component({
  selector: 'used-device-payment-info',
  templateUrl: './used-device-payment-info.component.html',
  standalone: true,
  imports: [
    PipesModule,
    UsedStepsListComponent,
  ],
  styleUrls: ['./used-device-payment-info.component.scss']
})
export class UsedDevicePaymentInfoComponent {

  @HostBinding('style.width') width = '100%';

  price = input<number>();
  listItems = input<UsedStepsListModel[]>();
}
