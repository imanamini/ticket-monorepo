import { Component, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  TitleValueContentComponent
} from '../../../../../../components/title-value-content/title-value-content.component';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { PolicyProductCardModel } from '../../../../data-access/models/policy-product-card.model';
import { InsuranceTabEnum } from '../../../../data-access/enums/policy-list.enum';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { PolicyCardService } from './data-access/services/policy-card.service';
import { PolicyCardThirdPartyCarService } from './data-access/services/policy-card-third-party-car.service';
import { PolicyCardBodyService } from './data-access/services/policy-card-body.service';
import { PolicyCardEquipmentService } from './data-access/services/policy-card-equipment.service';
import { PolicyCardHouseIncidentsService } from './data-access/services/policy-card-house-incidents.service';
import { PolicyCardTypeModel } from '../../data-access/models/policy-card-type.model';
import { PolicyCardThirdPartyMotorService } from './data-access/services/policy-card-third-party-motor.service';
import { LandingProviderEnum } from '../../../../../../data-access/enums/landing-provider.enum';
import { PolicyCardThirdPartyCarBimehService } from './data-access/services/policy-card-third-party-car-bimeh.service';

@Component({
  selector: 'policy-card',
  standalone: true,
  imports: [
    NgClass,
    NgxIcon,
    NgxBadgeModule,
    TitleValueContentComponent,
    InsButtonComponent,
    NgOptimizedImage,
    NgxCountDownComponent,
  ],
  templateUrl: './policy-card.component.html',
  styleUrl: './policy-card.component.scss'
})
export class PolicyCardComponent implements OnInit {
  data = input.required<PolicyProductCardModel<PolicyCardTypeModel>>();
  title = input.required<string>({alias: 'title-card'});
  buttonText = signal<string>('');
  showActionButton = signal<boolean>(false);
  showDetailButton = signal<boolean>(true);
  detailButtonText = signal<string>('');
  buttonRightIcon: WritableSignal<{ name: string; type: string } | null> = signal(null);
  brandButton: WritableSignal<boolean> = signal(false);
  isLoadingButton = signal<boolean>(false);
  defaultCardIcon = signal<{ [key: string]: string }>({
    [InsuranceTabEnum.THIRD_PARTY]: 'car',
    [InsuranceTabEnum.THIRD_PARTY_MOTOR]: 'motor',
    [InsuranceTabEnum.DIGITAL_EQUIPMENT]: 'digital-device',
    [InsuranceTabEnum.CAR_BODY]: 'car-crash',
  });
  protected readonly PolicyTypeEnum = InsuranceTabEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;

  private actionService = signal<PolicyCardService>(null);
  private policyCardThirdPartyCarService = inject(PolicyCardThirdPartyCarService);
  private policyCardThirdPartyCarBimehService = inject(PolicyCardThirdPartyCarBimehService);
  private policyCardThirdPartyMotorService = inject(PolicyCardThirdPartyMotorService);
  private policyCardBodyService = inject(PolicyCardBodyService);
  private policyCardEquipmentService = inject(PolicyCardEquipmentService);
  private policyCardHouseIncidentsService = inject(PolicyCardHouseIncidentsService);

  ngOnInit(): void {
    this.setActionService();
    this.setInitialData();
  }

  setInitialData(): void {
    this.showActionButton.set(this.actionService().showActionButton(this.data()));
    this.showDetailButton.set(this.actionService().showDetailButton(this.data()));
    this.buttonText.set(this.actionService().getActionButtonText(this.data()));
    this.detailButtonText.set(this.actionService().getDetailButtonText(this.data()));
    this.buttonRightIcon.set(this.actionService().getActionButtonRightIcon(this.data()));
    this.brandButton.set(this.actionService().isActionButtonBrand(this.data()));
  }

  setActionService(): void {
    switch (this.data().type) {
      case InsuranceTabEnum.THIRD_PARTY:
        switch (this.data().insuranceServiceProvider) {
          case LandingProviderEnum.Bimeh:
            this.actionService.set(this.policyCardThirdPartyCarBimehService);
            break;
          case LandingProviderEnum.Digipay:
            this.actionService.set(this.policyCardThirdPartyCarService);
            break;
        }
        break;
      case InsuranceTabEnum.THIRD_PARTY_MOTOR:
        this.actionService.set(this.policyCardThirdPartyMotorService);
        break;
      case InsuranceTabEnum.CAR_BODY:
        this.actionService.set(this.policyCardBodyService);
        break;
      case InsuranceTabEnum.DIGITAL_EQUIPMENT:
        this.actionService.set(this.policyCardEquipmentService);
        break;
      case InsuranceTabEnum.HOUSE_INCIDENT:
        this.actionService.set(this.policyCardHouseIncidentsService);
        break;
    }
  }

  protected handleButtonClicked(): void {
    if (this.isLoadingButton()) {
      return;
    }
    this.isLoadingButton.set(true);
    this.actionService().handleButtonClicked(this.data()).then(result => {
      this.isLoadingButton.set(false);
    });
  }

  protected handleDetailButtonClicked(): void {
    this.actionService().handleDetailButtonClicked(this.data());
  }
}

