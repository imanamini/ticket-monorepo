import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChargeInfo } from '@client-monorepo/applets/top-up';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'top-up-applet-fascinating-info',
  standalone: true,
  imports: [ApiImageModule],
  templateUrl: './fascinating-info.component.html',
  styleUrls: ['./fascinating-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FascinatingInfoComponent {
  data = input<ChargeInfo[]>([]);
}
