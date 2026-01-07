import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Step } from '../../data-access/models/credit/activation/step.model';
import { CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { UploadFileTileComponent } from './upload-file-tile/upload-file-tile.component';

@Component({
  selector: 'app-credit-upload-file-list',
  templateUrl: './credit-upload-file-list.component.html',
  styleUrls: ['./credit-upload-file-list.component.scss'],
  standalone: true,
  imports: [UploadFileTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditUploadFileListComponent {
  step = input<Step>();

  wallet = input<CreditWallet>();

  uploadSuccess = output<boolean>();

  maxUploadSize = input(0);

  uploadSucceed() {
    this.uploadSuccess.emit(true);
  }
}
