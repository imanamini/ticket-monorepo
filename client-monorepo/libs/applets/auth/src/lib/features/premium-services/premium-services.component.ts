import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { PremiumServiceComponent } from '../../components/premium-service/premium-service.component';
import { PremiumServicesOutputModel } from '@client-monorepo/applets/auth';
import { StorageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { AppApiService } from '@client-monorepo/common/service-data';
import { switchMap } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'auth-applet-premium-services',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, PremiumServiceComponent, NgxButtonComponent],
  templateUrl: './premium-services.component.html',
  styleUrl: './premium-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumServicesComponent implements OnInit {
  appApiService = inject(AppApiService);
  storageService = inject(StorageService);
  router = inject(Router);
  checks: PremiumServicesOutputModel[] = [];
  initialized = signal(false);

  ngOnInit(): void {
    this.getOnboardingNeeded();
  }

  getOnboardingNeeded(): void {
    this.appApiService.getPersonalizedServices().subscribe({
      next: (result) => {
        if (!result.needOnBoarding) {
          this.router.navigate(['/']).then();
        } else {
          this.initialized.set(true);
        }
      },
      error: () => {
        this.router.navigate(['/']).then();
      },
    });
  }

  checksChanged(event: PremiumServicesOutputModel): void {
    this.checks.push(event);
  }

  submit(): void {
    const ids: string[] = this.checks.map((check) => String(check.id));
    this.appApiService.storePremiumServices(ids).subscribe({
      next: () => {
        this.router.navigate(['auth', 'setting']).then();
      },
    });
  }

  handleSkip(): void {
    this.appApiService
      .storePremiumServices([])
      .pipe(
        switchMap(() => {
          return this.appApiService.editPersonalizedServices([]);
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/']).then();
        },
      });
  }
}
