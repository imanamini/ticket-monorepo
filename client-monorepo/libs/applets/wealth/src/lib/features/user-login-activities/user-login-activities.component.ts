import { Component, inject, OnInit } from '@angular/core';
import { UserLoginActivityComponent } from '../user-profile/components/user-login-activity/user-login-activity.component';
import { MaknaAuthenticationService } from '../makna-authentication/services/makna-authentication.service';
import { UserLoginActivityModel } from '../user-profile/models/user-login-activity.model';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../components/core/components/base/base.component';
import { PROFILE_ROUTE } from '../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';

@Component({
  selector: 'app-user-login-activities',
  standalone: true,
  imports: [UserLoginActivityComponent, NgxAppBarComponent],
  templateUrl: './user-login-activities.component.html',
  styleUrl: './user-login-activities.component.scss',
})
export class UserLoginActivitiesComponent extends BaseComponent implements OnInit {
  userLoginActivity: UserLoginActivityModel[] = [];
  private navigationService = inject(WealthNavigationService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.maknaAuthenticationService
      .sessions()
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        if (res?.success) {
          this.userLoginActivity = res.result.details;
        }
      });
  }

  onBackHandler() {
    this.navigationService.navigate([PROFILE_ROUTE]);
  }
}
