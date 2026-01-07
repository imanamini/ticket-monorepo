import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { EpdfType } from '../../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../../components/core/models/prospectus-route-state.interface';
import { PROSPECTUS_ROUTE } from '../../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fund-profile-footer',
  standalone: true,
  templateUrl: './fund-profile-footer.component.html',
  styleUrl: './fund-profile-footer.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundProfileFooterComponent {
  readonly pdfType = EpdfType;
  navigationService = inject(WealthNavigationService);

  assetSymbol = input.required<string>();

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      symbol: this.assetSymbol(),
      backToProfile: true,
      pdfType,
    };
    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}
