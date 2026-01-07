import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { ProfileInterface, UserDataService, VerificationService } from '@client-monorepo/common/user';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'payment-applet-verification-confirmation',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgOptimizedImage, NgxButtonComponent],
  templateUrl: './verification-confirmation.component.html',
  styleUrls: ['./verification-confirmation.component.scss'],
})
export class VerificationConfirmationComponent implements OnInit, OnDestroy {
  cellNumber = '';

  description = '';

  useCase!: string;

  sendingSms = false;

  userSubscription!: Subscription;

  constructor(
    private router: Router,
    private verificationService: VerificationService,
    private ms: MessageService,
    private deviceInfoService: DeviceInfoService,
    private userDataService: UserDataService,
    private bottomNavigationService: NgxBottomNavigationService,
  ) {
    this.deviceInfoService.getDeviceInfo().then();
  }

  ngOnInit() {
    this.bottomNavigationService.hide();
    if (!this.verificationService.anyFlowInProgress()) {
      this.router.navigateByUrl('/').then();
      return;
    }

    this.userDataService.getUserDetail().then((user) => {
      this.setCellNumber(user);
    });

    this.description = this.verificationService.description;
    this.useCase = this.verificationService.useCase;
  }

  private setCellNumber(user: ProfileInterface) {
    this.cellNumber = user.cellNumber;
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
          device: deviceInfo,
        })
        .subscribe(
          (data) => {
            this.sendingSms = false;
            this.router.navigateByUrl('/payment/verification/otp').then();
          },
          (e) => {
            this.sendingSms = false;
            this.ms.showErrorOfErrorResponse(e);
          },
        );
    });
  }

  // todo check ConditionsDialog use case with designer
  // openConditionsDialog(): void {
  //   this.dialog.open(ConditionsDialog, {
  //     panelClass: 'conditions-dialog-wrapper',
  //   });
  // }
}
