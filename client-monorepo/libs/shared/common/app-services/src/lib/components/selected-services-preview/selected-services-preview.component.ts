import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { FrequentServicesPreviewComponent } from '../frequent-services-preview/frequent-services-preview.component';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { AppServiceStatusEnum, FrequentServiceInterface } from '@client-monorepo/common/service-data';

@Component({
  selector: 'common-app-services-selected-services-preview',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, FrequentServicesPreviewComponent],
  templateUrl: './selected-services-preview.component.html',
  styleUrl: './selected-services-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedServicesPreviewComponent {
  services = input.required<Array<FrequentServiceInterface>>();
  isLoading = input<boolean>(true);
  rangeCreator = rangeCreator;
  selectedServices = computed(() => {
    const services = this.services();
    const selected = services.filter((s) => s.selected);
    const list = (selected.length ? selected : services).slice(0, 4);
    return list
      .map((service) => {
        return { ...service, selected: false };
      })
      .sort((service1, service2) => {
        if (service1.userPriority == null && service2.userPriority == null) return 0;
        if (service1.userPriority == null) return 1;
        if (service2.userPriority == null) return -1;
        return service1.userPriority - service2.userPriority;
      });
  });
  protected readonly AppServiceStatusEnum = AppServiceStatusEnum;
}
