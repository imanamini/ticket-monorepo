import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MessageService } from '../../../../../data-access/services/message.service';
import { CreditScrollableViewComponent } from '../../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { SelectionBoxComponent } from '../../../../../components/selection-box/selection-box.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { DeliveryProvider } from '../../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { CreditStepperComponent } from '../../../../../components/credit-stepper/credit-stepper.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditChequeDeliveryDateTimePickerBottomSheetComponent } from '../credit-cheque-delivery-date-time-picker-bottomsheet/credit-cheque-delivery-date-time-picker-bottom-sheet.component';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { CreditChequeStepService } from '../../../services/credit-cheque-step.service';
import { CreditPageLoadingComponent } from '../../../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-cheque-delivery-in-person-addresses',
  templateUrl: './credit-cheque-delivery-in-person-addresses.component.html',
  styleUrls: ['./credit-cheque-delivery-in-person-addresses.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    NgxButtonComponent,
    CreditScrollableViewComponent,
    SelectionBoxComponent,
    NgxTrackableIdDirective,
    CreditStepperComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryInPersonAddressesComponent implements OnInit {
  loading = signal(false);
  shapedAddresses = signal<DeliveryProvider[]>([]);
  selectedAddress = signal<DeliveryProvider | undefined>(undefined);
  selectedAddressIndex = signal<number | undefined>(undefined);
  back = output();
  next = output();
  goToCapacityError = output();
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private creditChequeStepService = inject(CreditChequeStepService);
  ngOnInit() {
    this.getBranchesAvailableTime();
  }
  getBranchesAvailableTime() {
    this.loading.set(true);
    const cityId = this.creditChequeStepService.selectedDeliveryCityId();
    this.creditApiService.getAvailableBranchDatesByCityIdAndCreditId(cityId!).subscribe({
      next: (response) => {
        const uniqueArray = Array.from(
          new Map(
            response.items.map((item) => {
              item.listOption = {
                label: item.deliveryProviderName,
                value: item.deliveryProviderId,
                selected: false,
              };
              return [JSON.stringify(item), item];
            }),
          ).values(),
        );
        this.shapedAddresses.set(uniqueArray);
        this.loading.set(false);
      },
      error: (error) => {
        if (error.result.status === this.creditChequeStepService.CREDIT_ONB_PICK_UP_CAPACITY_IS_FULL) {
          this.goToCapacityError.emit();
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  selectAddress(address?: any, index?: number) {
    this.shapedAddresses.set(
      JSON.parse(
        JSON.stringify(
          this.shapedAddresses().map((item, i) => {
            const newItem = { ...item };
            if (newItem.listOption) {
              newItem.listOption = { ...newItem.listOption, selected: false };
            }
            if (address && i === index) {
              if (newItem.listOption) {
                newItem.listOption = { ...newItem.listOption, selected: true };
              }
            }
            return newItem;
          }),
        ),
      ),
    );

    this.selectedAddress.set(address);
    this.selectedAddressIndex.set(index);
  }

  openTimePickerBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeDeliveryDateTimePickerBottomSheetComponent,
      {
        dates: this.selectedAddress()?.dates,
      },
      {
        noPadding: true,
      },
    );
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onCloseBottomSheet.unsubscribe();
        const selectedDeliveryDateTime = this.bottomSheetService.outputData();
        if (selectedDeliveryDateTime) {
          this.creditChequeStepService.setDeliverySelectedProvider(this.selectedAddress()!);
          this.creditChequeStepService.setDeliveryDateAndTime(selectedDeliveryDateTime);
          this.next.emit();
        }
      },
    });
  }
}
