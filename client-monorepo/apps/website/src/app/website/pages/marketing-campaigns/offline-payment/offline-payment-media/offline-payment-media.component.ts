import { Component, Input } from '@angular/core';
import { ApiFile } from '../../../../../api/clients/models/common/api-file';

@Component({
  selector: 'app-offline-payment-media',
  templateUrl: './offline-payment-media.component.html',
  standalone: true,
  styleUrls: ['./offline-payment-media.component.scss'],
})
export class OfflinePaymentMediaComponent {
  @Input() media: ApiFile;
}
