import { Component, inject, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { Router } from '@angular/router';
import { InsuranceHeaderComponent } from '../../../../components/insurance-header/insurance-header.component';
import { ActionButtonsComponent } from '../../../../components/action-buttons/action-buttons.component';
import { SectionCardComponent } from '../../../../components/section-card/section-card.component';
import { ThirdPartyKeysEnum } from '../../../vehicle/features/third-party/data-access/enums/third-party-keys.enum';
import { InsAlertComponent } from '../../../../components/ins-alert/ins-alert.component';
import {
  FullScreenLoadingComponent
} from '../../../../components/full-screen-loading/full-screen-loading.component';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { BaseComponent } from '../../../../components/base/base.component';
import { InsuranceKeysEnum } from '../../../../data-access/enums/insurance-keys.enum';
import { SectionCardModel } from '../../../../data-access/models/section-card.model';
import { AlertColorEnum } from '../../../../data-access/enums/alert-color.enum';
import { AlertSizeEnum } from '../../../../data-access/enums/alert-size.enum';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { InsuranceTabEnum } from '../../data-access/enums/policy-list.enum';
import { PolicyDetailService } from './data-access/services/policy-detail.service';
import { PolicyDetailThirdPartyCarService } from './data-access/services/policy-detail-third-party-car.service';
import { PolicyDetailThirdPartyMotorService } from './data-access/services/policy-detail-third-party-motor.service';
import { PolicyDetailBodyService } from './data-access/services/policy-detail-body.service';
import { PolicyDetailEquipmentService } from './data-access/services/policy-detail-equipment.service';
import { HeaderIconModel } from '../../../../data-access/models/header-icon.model';

@Component({
  selector: 'policy-detail',
  standalone: true,
  imports: [
    InsuranceHeaderComponent,
    SectionCardComponent,
    PipesModule,
    ActionButtonsComponent,
    FullScreenLoadingComponent,
    InsAlertComponent
  ],
  templateUrl: './policy-detail.component.html',
  styleUrl: './policy-detail.component.scss',
})
export class PolicyDetailComponent extends BaseComponent implements OnInit {
  details = signal<SectionCardModel[]>([]);
  isLoading = signal<boolean>(false);
  infoText = signal<string>('');
  majorButtonText = signal<string>('');
  minorButtonText = signal<string>('');
  showMajorActionButton = signal<boolean>(false);
  showMinorActionButton = signal<boolean>(false);
  hasPriceConflict = signal<boolean>(false);
  payable = signal<number>(0);
  alertColor = signal<AlertColorEnum>(AlertColorEnum.Blue);
  headerLeftIcons = signal<HeaderIconModel[]>([]);
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  protected readonly IconEnum = IconEnum;

  private policyDetailThirdPartyCarService = inject(PolicyDetailThirdPartyCarService);
  private policyDetailThirdPartyMotorService = inject(PolicyDetailThirdPartyMotorService);
  private policyDetailEquipmentService = inject(PolicyDetailEquipmentService);
  private policyDetailBodyService = inject(PolicyDetailBodyService);
  private policyDetailService = signal<PolicyDetailService>(null);
  private router = inject(Router);

  ngOnInit(): void {
    this.setService();
    this.getPolicyDetail();
  }

  setService(): void {
    const policyType: InsuranceTabEnum = this.activatedRoute.snapshot.queryParams[InsuranceKeysEnum.POLICY_TYPE];
    switch (policyType) {
      case InsuranceTabEnum.CAR_BODY:
        this.policyDetailService.set(this.policyDetailBodyService);
        break;
      case InsuranceTabEnum.THIRD_PARTY_MOTOR:
        this.policyDetailService.set(this.policyDetailThirdPartyMotorService);
        break;
      case InsuranceTabEnum.THIRD_PARTY:
        this.policyDetailService.set(this.policyDetailThirdPartyCarService);
        break;
      case InsuranceTabEnum.DIGITAL_EQUIPMENT:
        this.policyDetailService.set(this.policyDetailEquipmentService);
        break;
    }
  }

  getPolicyDetail(): void {
    this.isLoading.set(true);
    const formId = this.activatedRoute.snapshot.queryParams[ThirdPartyKeysEnum.FormId];
    if (!formId) {
      this.isLoading.set(false);
      return;
    }
    this.policyDetailService().getPolicyDetail(formId).then(result => {
      this.details.set(result);
      this.isLoading.set(false);
      this.setUiRelatedStuff();
    });
  }

  handleActiveButtonClicked(): void {
    this.policyDetailService().majorActionButtonHandler();
  }

  handleBackClicked(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['policy', 'list']);
    }
  }

  setUiRelatedStuff(): void {
    this.showMajorActionButton.set(this.policyDetailService().showMajorActionButton());
    this.showMinorActionButton.set(this.policyDetailService().showMinorActionButton());
    this.majorButtonText.set(this.policyDetailService().getMajorActionButtonText());
    this.minorButtonText.set(this.policyDetailService().getMinorActionButtonText());
    this.hasPriceConflict.set(this.policyDetailService().hasPriceConflict());
    this.infoText.set(this.policyDetailService().getInfoText());
    this.alertColor.set(this.policyDetailService().getAlertColor());
    this.payable.set(this.policyDetailService().payable);
    if (this.policyDetailService().hasMoreActions()) {
      this.setMoreActions();
    }
  }

  setMoreActions(): void {
    this.headerLeftIcons.set([
      {
        name: 'info-menu' as IconEnum,
        clickHandler: () => {
          this.policyDetailService().moreActionsHandler();
        },
        class: 'bold'
      }
    ]);
  }

  minorActionButtonClicked(): void {
    this.policyDetailService().minorActionButtonHandler();
  }
}
