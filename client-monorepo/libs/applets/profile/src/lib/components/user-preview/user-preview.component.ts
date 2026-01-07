import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { RouterLink } from '@angular/router';
import { ProfileInterface, UserApiService } from '@client-monorepo/common/user';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { Subscription } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-user-preview',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxSkeletonLoadingComponent, RouterLink, PipesModule, NgxButtonComponent],
  templateUrl: './user-preview.component.html',
  styleUrl: './user-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPreviewComponent implements OnDestroy, OnInit {
  isLoading = signal<boolean>(true);
  user = signal<ProfileInterface | null>(null);
  userApiService = inject(UserApiService);
  profileSubscription!: Subscription;

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
