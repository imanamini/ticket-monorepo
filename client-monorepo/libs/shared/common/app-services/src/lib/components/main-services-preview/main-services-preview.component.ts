import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { FrequentServiceInterface, ServiceImagesType } from '@client-monorepo/common/service-data';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';

@Component({
  selector: 'common-app-services-main-services-preview',
  standalone: true,
  imports: [FramedIconComponent, NgxSkeletonLoadingComponent, NgxRouterLoadingDirective],
  templateUrl: './main-services-preview.component.html',
  styleUrl: './main-services-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainServicesPreviewComponent {
  private router = inject(Router);
  services = input.required<Array<FrequentServiceInterface>>();
  isLoading = input<boolean>(true);
  clickOnService = output<FrequentServiceInterface>();
  rangeCreator = rangeCreator;
  filterServices = computed(() => {
    return this.services()
      .sort((a, b) => a.priority! - b.priority!)
      .slice(0, 7);
  });
  onServiceClicked(service: FrequentServiceInterface): void {
    this.clickOnService.emit(service);
  }
  private eventManagementService = inject(EventManagementService);

  onAllServicesClicked(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub'],
      data: {
        target: `service: all-services`,
      },
    });
    this.router.navigateByUrl('hub/main-services').then();
  }
  protected readonly ServiceImagesType = ServiceImagesType;
}
