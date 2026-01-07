import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FrequentServicesSelectorComponent } from '@client-monorepo/common/app-services';
import { Router } from '@angular/router';
import { AppApiService, AppService, FrequentServiceInterface, ServiceTypeEnum } from '@client-monorepo/common/service-data';

@Component({
  selector: 'auth-applet-app-setting',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, FrequentServicesSelectorComponent],
  templateUrl: './app-setting.component.html',
  styleUrl: './app-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSettingComponent implements OnInit {
  appService = inject(AppService);
  router = inject(Router);
  appApiService = inject(AppApiService);
  isLoading = signal<boolean>(true);
  frequentServices = signal<Array<FrequentServiceInterface>>([]);

  ngOnInit() {
    this.getServices();
  }

  private getServices(): void {
    this.appService.getMappedServices().subscribe({
      next: (result) => {
        this.frequentServices.set(
          result.filter((service) => {
            return service.type === ServiceTypeEnum.MAIN_SERVICE;
          }),
        );
        this.isLoading.set(false);
      },
    });
  }

  frequentServicesChange(services: Array<FrequentServiceInterface>): void {
    this.frequentServices.set(services);
  }

  handleSkip(): void {
    this.appApiService.editPersonalizedServices([]).subscribe({
      next: () => {
        this.router.navigate(['/']).then();
      },
    });
  }

  onSubmit(): void {
    this.router.navigate(['/']).then();
  }
}
