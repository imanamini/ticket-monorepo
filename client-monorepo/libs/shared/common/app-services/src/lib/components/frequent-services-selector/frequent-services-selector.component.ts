import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequentServicesPreviewComponent } from '../frequent-services-preview/frequent-services-preview.component';
import { MessageService, rangeCreator } from '@client-monorepo/common/utilities';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { AppApiService, FrequentServiceInterface } from '@client-monorepo/common/service-data';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-app-services-frequent-services-selector',
  standalone: true,
  imports: [CommonModule, FrequentServicesPreviewComponent, NgxButtonComponent],
  templateUrl: './frequent-services-selector.component.html',
  styleUrl: './frequent-services-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrequentServicesSelectorComponent implements OnInit, OnDestroy {
  frequentServices = model.required<Array<FrequentServiceInterface>>();
  isLoading = input<boolean>(false);
  btnText = input<string>('ذخیره تغییرات');
  isSubmitting = signal<boolean>(false);
  submitted = output<void>();
  rangeCreator = rangeCreator;
  cdr = inject(ChangeDetectorRef);
  appServiceApiService = inject(AppApiService);
  messageService = inject(MessageService);
  bottomNavigationService = inject(NgxBottomNavigationService);

  selectedServicesOrder = computed<(FrequentServiceInterface | null)[]>(() => {
    const orderedServices = new Array(4).fill(null);
    this.frequentServices()
      .filter((service) => service.selected)
      .forEach((service) => {
        if (service.userPriority != null && service.userPriority >= 0 && service.userPriority < 4) {
          orderedServices[service.userPriority] = service;
        }
      });
    return orderedServices;
  });

  boxStyle = computed(() => {
    return {
      bottom: this.bottomNavigationService.reservedHeight() + 'px',
    };
  });

  ngOnInit() {
    this.bottomNavigationService.hide();
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
  }

  handleClick(targetService: FrequentServiceInterface): void {
    const currentFrequentServices = this.frequentServices();

    if (!targetService.selected) {
      const emptyIndex = this.selectedServicesOrder().findIndex((service) => service === null);

      if (emptyIndex !== -1) {
        this.frequentServices.set(
          currentFrequentServices.map((service) => {
            if (service.id === targetService.id) {
              return {
                ...service,
                selected: true,
                userPriority: emptyIndex,
              };
            }
            return service;
          }),
        );
      }
    } else {
      this.removeItem(targetService);
    }
  }

  removeItem(targetService: FrequentServiceInterface): void {
    const updatedFrequentServices = this.frequentServices().map((service) => {
      if (service.id === targetService.id) {
        return {
          ...service,
          selected: false,
          userPriority: null,
        };
      }
      return service;
    });

    this.frequentServices.set(updatedFrequentServices);
  }

  submitForm(): void {
    const allSelected = this.selectedServicesOrder().length === 4 && this.selectedServicesOrder().every((service) => service !== null);
    if (allSelected) {
      if (!this.isSubmitting()) {
        this.isSubmitting.set(true);
        this.appServiceApiService.editPersonalizedServices(this.selectedServicesOrder().map((service) => service?.uuid ?? '')).subscribe({
          next: () => {
            this.submitted.emit();
            this.isSubmitting.set(false);
          },
        });
      }
    } else {
      this.messageService.showErrorMessage('لطفا 4 مورد انتخاب نمایید');
    }
  }
}
