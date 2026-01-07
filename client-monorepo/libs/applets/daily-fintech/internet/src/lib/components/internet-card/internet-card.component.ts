import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { BundleCategory, InternetPackage } from '../../data-access/models/internet-purchase.response';
import { Router } from '@angular/router';
import { InternetService } from '@client-monorepo/applets/internet';
import { NgClass, NgForOf } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { InternetConfirmationDialogComponent } from '../internet-package-confirmation-dialog/internet-confirmation-dialog.component';
import { state } from '@angular/animations';
import { InternetConfirm } from '../../data-access/models/internet-confirm.model';
import { MobileOperator } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { OperatorEnum } from '@client-monorepo/payment/transactions';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'internet-applet-card',
  templateUrl: './internet-card.component.html',
  standalone: true,
  styleUrls: ['./internet-card.component.scss'],
  imports: [NgClass, NgForOf, ApiImageModule, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternetCardComponent implements OnInit {
  // Injects
  private router = inject(Router);
  private internetService = inject(InternetService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private eventService = inject(NgxEventTrackerService);

  // Signals
  cards = input<InternetPackage[]>([]);
  packageTitles = input<BundleCategory>({} as BundleCategory);
  needApproval = signal(false);
  simType = signal('');
  cellNumber = signal('');
  operatorId = signal('');
  operatorName = signal('');
  operator = signal<MobileOperator>({} as MobileOperator);

  ngOnInit(): void {
    this.internetService.getConfirmData().subscribe((data) => {
      if (!data) {
        this.router.navigateByUrl('internet').then();
        return;
      }
      this.cellNumber.set(data.cellNumber);
      this.operatorId.set(data.operatorId ? data.operatorId : '');
      this.operatorName.set(data.operatorName);
      this.simType.set(data.simType);
      this.operator.set(data.operator);
    });
  }

  checkOperator(operatorId?: string): string | undefined {
    const operatorClassMap: Record<string, string> = {
      [OperatorEnum.MCI]: 'is-mci',
      [OperatorEnum.MTN]: 'is-mtn',
      [OperatorEnum.RIGHTEL]: 'is-rightel',
      [OperatorEnum.SHATEL]: 'is-shatel',
    };

    return operatorId ? operatorClassMap[operatorId] : undefined;
  }

  checkNeedToApprove(selectPackage: InternetPackage) {
    this.needApproval.set(selectPackage.needApproval ?? false);
    if (this.needApproval()) {
      this.bottomSheetService.openBottomSheet(InternetConfirmationDialogComponent, {
        package: selectPackage,
        packageTitle: this.packageTitles(),
        cellNumber: this.cellNumber(),
        operatorId: this.operatorId(),
        simType: this.simType(),
        operator: this.operator(),
      });
      const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
        if (!this.bottomSheetService.outputData()?.result) {
          return;
        }
        this.selectPackage(selectPackage);
        bottomSheetSubscriber.unsubscribe();
      });
    } else {
      this.selectPackage(selectPackage);
    }
  }

  navigateToConfirm() {
    this.router
      .navigate(['internet', 'confirm'], {
        state: {
          ...state,
        },
      })
      .then();
  }

  selectPackage(selectedPackage: InternetPackage): void {
    this.internetService.setPackageData({
      bundleId: selectedPackage.bundleId,
      amount: selectedPackage.amount,
      description: selectedPackage.description,
      duration: selectedPackage.duration,
      imageId: selectedPackage.imageId,
    });
    const bundleTitle = this.packageTitles().bundleSections[0].title;
    const confirmModel: InternetConfirm = {
      bundleTitle,
      cellNumber: this.cellNumber(),
      operatorId: this.operatorId(),
      operatorName: this.operatorName(),
      simType: this.simType(),
      operator: this.operator(),
    };
    // this.sendEvent(selectedPackage);
    this.internetService.setConfirmData(confirmModel);
    this.navigateToConfirm();
  }
  private sendEvent(selectedPackage: InternetPackage) {
    const eventData = {
      eventName: 'internet-package-selected',
      eventData: {
        pkg_amount: selectedPackage?.amount,
        pkg_duration: selectedPackage?.duration,
        pkg_name: selectedPackage?.description,
      },
    };
    this.eventService.sendEvent(eventData);
  }
}
