import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { C2cStateService } from '../../data-access/services/c2c-state.service';

@Component({
  selector: 'c2c-applet-c2c-general-banks-bottom-sheet',
  standalone: true,
  imports: [ApiImageModule],
  templateUrl: './c2c-general-banks-bottom-sheet.component.html',
  styleUrls: ['./c2c-general-banks-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cGeneralBanksBottomSheetComponent {
  c2cStateService = inject(C2cStateService);
  allBanks = computed(() => this.c2cStateService.allBanks());
}
