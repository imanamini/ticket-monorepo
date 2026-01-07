import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../data-access/services/credit-api.service';
import { CreditUrlService } from '../data-access/utils/url';
import { BaseApiService } from '../data-access/services/base-api.service';
import { CreditUserService } from '../data-access/services/credit-user.service';
import { LoggedInUser } from '../data-access/services/logged-in-user.model';
import { CreditPageLoadingComponent } from '../components/credit-page-loading/credit-page-loading.component';
import { CreditSwitchCellNumberComponent } from '../components/credit-switch-cell-number/credit-switch-cell-number.component';
import { CreditAppBarComponent } from '../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-pre-registration-by-campaign-data',
  templateUrl: './pre-registration-by-campaign-data.component.html',
  styleUrls: ['./pre-registration-by-campaign-data.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditSwitchCellNumberComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationByCampaignDataComponent implements OnInit {
  campaignId!: string;
  userData = signal<LoggedInUser | null>(null);
  cellNumberOnCampaign = signal<string | null>(null);
  showLoading = signal<boolean>(true);
  errorType!: 'INCORRECT_CELL_NUMBER' | 'CAMPAIGN_DATA_NOT_FOUND' | 'HAS_ACTIVATION';

  private creditApiService = inject(CreditApiService);
  private userService = inject(CreditUserService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private apiService = inject(BaseApiService);

  ngOnInit() {
    this.userData.set(this.userService.getUserData());
    this.activatedRoute.params.subscribe((params) => {
      this.campaignId = params['campaignId'];
    });
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.cellNumberOnCampaign.set(queryParams['cellNumber'] || null);
    });
    this.userService.currentUser().then((user) => {
      this.userData.set(user);
      if (this.cellNumberOnCampaign() === this.userData()?.cellNumber) {
        this.preRegister();
      } else {
        this.showLoading.set(false);
        this.errorType = 'INCORRECT_CELL_NUMBER';
      }
    });
  }

  preRegister() {
    this.creditApiService.preRegisterByCampaign(this.campaignId).subscribe({
      next: () => {
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
        this.showLoading.set(false);
      },
      error: () => {
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
        this.showLoading.set(false);
      },
    });
  }

  loginAgain() {
    this.apiService.post('users/logout', {}).subscribe(() => {
      this.userService.purgeAuth(false);
      window.location.reload();
    });
  }

  cancel() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
  }
}
