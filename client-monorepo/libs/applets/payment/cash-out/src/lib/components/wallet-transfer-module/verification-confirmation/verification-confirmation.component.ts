import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VerificationService } from '../../../data-access/services/verification.service';
import { Subscription } from 'rxjs';
import { DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ConditionsDialogComponent } from '../conditions-dialog/conditions.dialog';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { UserCellNumberService } from '../../../data-access/services/user-cell-number.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'cash-out-applet-verification-confirmation',
  templateUrl: './verification-confirmation.component.html',
  styleUrls: ['./verification-confirmation.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, NgxButtonComponent, NgxSkeletonLoadingComponent]
})
export class VerificationConfirmationComponent implements OnInit, OnDestroy {
  description = '';

  useCase!: string;

  sendingSms = false;

  userSubscription!: Subscription;
  private bottomSheet = inject(NgxBottomSheetService);

  constructor(
    private router: Router,
    private verificationService: VerificationService,
    private deviceInfoService: DeviceInfoService,
    public userCellNumberService: UserCellNumberService,
    private messageService: MessageService
  ) {
    this.deviceInfoService.getDeviceInfo().then();
  }

  ngOnInit() {
    this.description = this.verificationService.description;
    this.useCase = this.verificationService.useCase;
    this.userCellNumberService.get().then();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  accept() {
    this.sendingSms = true;
    this.deviceInfoService.getDeviceInfo().then((deviceInfo) => {
      this.verificationService
        .sendOtp({
          device: deviceInfo
        })
        .subscribe(
          (data) => {
            this.sendingSms = false;
            this.router.navigateByUrl('/cash-out/verify-otp').then();
          },
          (e) => {
            this.sendingSms = false;
            this.messageService.showErrorOfErrorResponse(e);
          }
        );
    });
  }

  getBackUrl(): string {
    return this.verificationService.backUrl;
  }

  openConditionsDialog(): void {
    this.bottomSheet.openBottomSheet(ConditionsDialogComponent,
      {},
      { height: '50%' }
    );
  }
}
