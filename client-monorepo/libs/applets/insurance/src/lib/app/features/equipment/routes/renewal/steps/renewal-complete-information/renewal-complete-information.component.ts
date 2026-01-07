import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { Subscription } from 'rxjs';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { NgIf } from '@angular/common';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { SetSerialBodyModel } from '../../../../api/models/renewal/set-serial-body.model';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-complete-information',
  templateUrl: './renewal-complete-information.component.html',
  standalone: true,
  imports: [UiFormFieldBuilderModule, FormsModule, JourneyButtonsComponent, NgIf],
  styleUrls: ['./renewal-complete-information.component.scss'],
})
export class RenewalCompleteInformationComponent implements OnInit, OnDestroy {
  constructor(
    private renewalApiService: RenewalApiService,
    private messageService: MessageService,
    private sharedService: SharedRenewalService,
  ) {}

  readonly ProductCategoryModel = ProductCategoryModel;

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  serialNumber: string;
  uniqueCode: string;
  isSubmitting: boolean;
  productCategory: ProductCategoryModel;

  ngOnInit(): void {
    this.sharedService.setJourney(JourneyNamesModel.RENEWAL);
    this.getUniqueCode();
  }

  getUniqueCode(): void {
    this.sharedService.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
  }

  getOrderInfo(): void {
    this.subscriptions[0] = this.renewalApiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.productCategory = ProductCategoryModel[res.data.productCategory];
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
  }

  goToNextStep(): void {
    this.setSerial()
      .then(() => {
        this.sharedService.setStepChangeSubject('NEXT');
      })
      .catch((e) => {});
  }

  setSerial(): Promise<void> {
    this.isSubmitting = true;
    return new Promise<void>((resolve, reject) => {
      const body: SetSerialBodyModel = {
        key: this.uniqueCode,
        serial: this.serialNumber,
      };
      this.subscriptions[1] = this.renewalApiService.setSerial(body).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          resolve();
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
          this.isSubmitting = false;
          reject(e);
        },
      });
    });
  }

  isInvalid(): boolean {
    if (this.serialNumber) {
      this.serialNumber = this.serialNumber.trim();
    }
    return this.isSubmitting || !this.serialNumber || this.serialNumber === '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
