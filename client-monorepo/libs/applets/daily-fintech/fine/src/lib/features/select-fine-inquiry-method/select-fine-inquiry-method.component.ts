import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FineApiService, FineConfigResponse, FinePlate, InquiryType, VehicleType } from '@client-monorepo/daily-fintech/vehicle-data';
import { MessageService } from '@client-monorepo/common/utilities';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ActivatedRoute, Router } from '@angular/router';
import { FineCheckIdentityComponent } from '../../components/fine-check-identity/fine-check-identity.component';
import { FineOtpComponent } from '../../components/fine-otp/fine-otp.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'fine-applet-select-fine-inquiry-method',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DpIconComponent,
    PipesModule,
    NgxRadioButtonComponent,
    NgxCalloutComponent,
    NgxButtonComponent,
  ],
  templateUrl: './select-fine-inquiry-method.component.html',
  styleUrl: './select-fine-inquiry-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFineInquiryMethodComponent implements OnInit {
  fineApiService = inject(FineApiService);
  messageService = inject(MessageService);
  bottomSheetService = inject(NgxBottomSheetService);
  plateNo!: string;
  config = signal<FineConfigResponse | null>(null);
  inquiryTypeToIconMap: { [key in InquiryType]: string } = {
    [InquiryType.GENERAL]: 'traffic-signal',
    [InquiryType.PARTIAL]: 'docuemnt-file',
  };
  selectedType = signal<InquiryType>(InquiryType.GENERAL);
  plate = signal<FinePlate | null>(null);
  route = inject(ActivatedRoute);
  router = inject(Router);
  backHandlerService = inject(BackHandlerService);

  ngOnInit(): void {
    this.getConfig();
    this.plateNo = this.route.snapshot.params['plateNo'];
    this.getPlateData(this.plateNo);
  }

  getPlateData(plateNo: string) {
    this.fineApiService.getFinePlateDetail(plateNo).subscribe((res) => {
      if (!res) {
        this.router.navigate(['fine']).then();
        return;
      }
      this.plate.set(res);
    });
  }

  getConfig() {
    this.fineApiService.getConfig().subscribe({
      next: (res) => {
        this.config.set(res);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  onSubmit() {
    if (this.plate()?.owner) {
      this.goToNextStep();
      return;
    }
    this.bottomSheetService.openBottomSheet(FineCheckIdentityComponent, {
      phoneNumber: this.config()?.user.cellNumber,
      nationalCode: this.config()?.user.nationalCode,
      plateNo: this.plateNo,
    });
    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      const data = this.bottomSheetService.outputData();
      if (data?.error) {
        if (data.error.error.result.status === 17103) {
          this.getOtp(data.cellNumber, data.nationalCode);
        } else {
          this.messageService.showErrorMessage('اطلاعات وارد شده صحیح نمی‌باشد');
        }
      }
      if (data?.result) {
        this.goToNextStep();
      }
      bottomSheetSubscriber.unsubscribe();
    });
  }

  getOtp(cellNumber: string, nationalCode: string) {
    this.bottomSheetService.outputData.set(null);
    this.bottomSheetService.openBottomSheet(FineOtpComponent, {
      plateNo: this.plateNo,
      cellNumber,
      nationalCode,
    });
    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      if (this.bottomSheetService.outputData()) {
        this.goToNextStep();
      }
      bottomSheetSubscriber.unsubscribe();
    });
  }

  goToNextStep() {
    this.router
      .navigate(['fine', 'inquiry', 'confirm'], {
        state: {
          plateNo: this.plateNo,
          inquiryType: this.selectedType(),
          type: VehicleType.CAR,
          config: this.config(),
        },
      })
      .then();
  }

  goToPrevPage() {
    this.backHandlerService.setCustomBackUrl('fine');
    this.backHandlerService.goBack();
  }
}
