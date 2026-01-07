import { Component, inject, OnInit, signal } from '@angular/core';
import { FlokiHeaderComponent } from '../../ui-component/floki-header/floki-header.component';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationFormService } from '../../services/application-form.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DeviceValueGuideComponent } from '../device-value-guide/device-value-guide.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { FlokiRoutesEnum } from '../../enums/floki-routes.enum';
import { MessageService } from '@client-monorepo/common/utilities';
import { BaseComponent } from '../../../../components/base/base.component';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { RialToTomanPipe } from '../../../../pipes/convert-rial-to-toman.pipe';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';

@Component({
  selector: 'device-value',
  standalone: true,
  imports: [FlokiHeaderComponent, NgxAlert, NgxButtonComponent, ReactiveFormsModule, UiFormFieldBuilderModule, RialToTomanPipe],
  templateUrl: './device-value.component.html',
  styleUrl: './device-value.component.scss',
})
export class DeviceValueComponent extends BaseComponent implements OnInit {
  private readonly PRICE_GUIDING_MODAL_FRAGMENT = 'price-guide';
  applicationFormService = inject(ApplicationFormService);
  messageService = inject(MessageService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private bottomSheetService = inject(BottomSheetService);
  form: FormGroup;
  isSubmitting = signal<boolean>(false);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.generateForm();
    if (this.activatedRoute.snapshot.fragment === this.PRICE_GUIDING_MODAL_FRAGMENT) {
      this.openPricingGuid();
    }
    super.addSubscription(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
          this.bottomSheetService.closeCurrentBottomSheet();
        }
      }),
    );
  }

  public openPricingGuid(): void {
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        fragment: this.PRICE_GUIDING_MODAL_FRAGMENT,
        replaceUrl: true,
      })
      .then(() => {
        super.addSubscription(
          this.bottomSheetService
            .open(BottomSheetBoxComponent, {
              component: DeviceValueGuideComponent,
              name: 'DeviceValueGuideBottomSheet',
            })
            .afterDismissed()
            .subscribe({
              next: () => {
                this.router
                  .navigate([], {
                    relativeTo: this.activatedRoute,
                    fragment: null,
                    replaceUrl: true,
                  })
                  .then();
              },
            }),
        );
      });
  }

  private generateForm(): void {
    this.form = new FormGroup({
      assetPrice: new FormControl<number>(null, [Validators.required, Validators.min(10_000_000), Validators.max(1_700_000_000)]),
    });
  }

  private goToPlpPage(id: string): void {
    this.router
      .navigate([FlokiRoutesEnum.PLP], {
        relativeTo: this.activatedRoute,
        queryParams: { [QueryParamsEnum.ApplicationId]: id },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  public submitApplicationForm(): void {
    if (this.form?.controls?.assetPrice?.valid) {
      this.isSubmitting.set(true);
      const subscription = this.applicationFormService
        .patchApplicationForm({
          assetPrice: +this.form?.controls?.assetPrice?.value,
          applicationFormId: null,
        })
        .subscribe({
          next: (res) => {
            this.goToPlpPage(res.result.applicationFormId);
            this.isSubmitting.set(false);
          },
          error: (e) => {
            this.isSubmitting.set(false);
            // this.messageService.showErrorInFloki(e);
          },
        });
      super.addSubscription(subscription);
    }
  }
}
