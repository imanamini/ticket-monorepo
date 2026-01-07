import { Component, inject, OnInit, signal } from '@angular/core';

import { ImageComponent } from '../../../../shared/components/image/image.component';
import { IButton } from '../../../ipo/models/ipo-buttons.interface';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { OTP_ROUTE } from '../../../../data-access/constants/app-routes';
import { NgxAlert } from '@digipay/ngx-alert';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { EVerifyCustomerState } from '../../../../components/core/models/verify-customer-state.enum';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { IInstrumentSetting } from '../../models/fund-sejami.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { MessageService } from '@client-monorepo/common/utilities';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'wealth-applet-update-sejam',
  standalone: true,
  imports: [ImageComponent, NgxButtonComponent, NgxAlert, NgxBadgeModule, SpinnerComponent, NgClass],
  templateUrl: './update-sejam.component.html',
  styleUrl: './update-sejam.component.scss',
})
export class UpdateSejamComponent implements OnInit {
  selectedItem: string;
  instroments: IInstrumentSetting[] = [];

  buttons: IButton[] = [];
  navigationService = inject(WealthNavigationService);
  isLoading = signal<boolean>(true);

  private bottomSheet = inject(NgxBottomSheetService);
  private fundDataService = inject(FundDataService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.getData();
    this.buttons = [
      {
        id: 'close',
        label: 'بستن',
        style: 'tinted-on-elevated',
        loading: false,
      },
      {
        id: 'continue',
        label: 'تایید و ادامه',
        style: 'fill',
        disabled: true,
        loading: false,
      },
    ];
  }

  getData() {
    this.fundDataService.getFundSejamiProfile().subscribe((profile) => {
      if (profile?.success) {
        this.instroments = profile.result.instrumentSettings;
      }
      this.isLoading.set(false);
    });
  }

  selectInstrument(instrument: IInstrumentSetting) {
    if (!instrument.isUpdated) {
      this.selectedItem = instrument.symbol;
      this.buttons[1].disabled = false;
    }
  }

  clickHandler(id: string) {
    if (id === 'close') {
      this.bottomSheet.closeBottomSheet();
    } else {
      this.buttons.find((btn) => btn.id === id).loading = true;
      this.fundDataService.verifyCustomerUpdateSejam(this.selectedItem).subscribe((res) => {
        if (res?.success) {
          if (res.result.state === EVerifyCustomerState.RequiresOtp) {
            this.navigationService
              .navigate([OTP_ROUTE], {
                state: {
                  symbol: this.selectedItem,
                  updateSejam: true,
                },
              })
              .then(() => {
                this.bottomSheet.closeBottomSheet();
              });
          }
        } else {
          this.messageService.showErrorMessage(res?.error?.title);
          this.bottomSheet.closeBottomSheet();
        }
        this.buttons.find((btn) => btn.id === id).loading = false;
      });
    }
  }
}
