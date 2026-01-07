import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE, SEJAM_NATIONAL_ID_ROUTE, SEJAM_SUCCESS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ProfileService } from '../../../../components/core/services/profile.service';
import { UserInfoModel } from '../../../user-profile/models/user-info.model';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'wealth-applet-sejam-check',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent, SpinnerComponent],
  templateUrl: './sejam-check.component.html',
  styleUrl: './sejam-check.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SejamCheckComponent implements OnInit {
  isLoading = signal(false);
  user: UserInfoModel;

  private profileService = inject(ProfileService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      if (res?.success) {
        this.user = res.result;
      }
    });
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  gotIt() {
    if (this.user?.isSejami) {
      this.navigationService.navigateWithState([SEJAM_SUCCESS_ROUTE], {
        state: { hasAccess: true, prevRoute: 'home' },
      });
    } else {
      this.navigationService.navigate([SEJAM_NATIONAL_ID_ROUTE]);
    }
  }
}
