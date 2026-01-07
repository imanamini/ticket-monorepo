import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ProfileInterface, UserApiService } from '@client-monorepo/common/user';
import { Subscription } from 'rxjs';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-profile-applet-user-preview',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxSkeletonLoadingComponent, PipesModule, NgxButtonComponent],
  templateUrl: './user-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPreviewComponent implements OnDestroy, OnInit {
  user = signal<ProfileInterface | null>(null);
  userApiService = inject(UserApiService);
  profileSubscription!: Subscription;
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.initPage();
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
  }

  initPage(): void {
    this.profileSubscription = this.userApiService.getProfile().subscribe({
      next: (result) => {
        this.user.set(result);
        this.isLoading.set(false);
      },
    });
  }
}
