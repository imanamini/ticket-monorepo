import { Component, Input, OnInit } from '@angular/core';
import { StyledSwitchOption } from '../../../../../../ui/models/switch-option.model';
import { ScreenSize } from '../../../../../../api/digipay/models/common/screen-size';
import { LayoutService } from '../../../../../services/layout.service';
import { Registering } from '../../../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { ActivatedRoute } from '@angular/router';
import { CreditCalculatorService } from '../../../../../../api/clients/credit/credit-calculator/credit-calculator.service';
import { UiComplexAccordionComponent } from '../../../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component';
import { CreditCalculatorV3Component } from '../../../../../../ui/ui-components/ui-credit/credit-calculator-v3/credit-calculator-v3.component';
import { NgFor, NgIf } from '@angular/common';
import { CreditRegisterBenefitsComponent } from '../../../../../../ui/ui-components/ui-credit/credit-register-benefits/credit-register-benefits.component';
import { UiAnimatedSwitchComponent } from '../../../../../../ui/ui-components/ui-switch/ui-animated-switch/ui-animated-switch.component';
import { CCreditMapsComponent } from '../c-credit-maps/c-credit-maps.component';

@Component({
  selector: 'app-c-credit-registering',
  templateUrl: './c-credit-registering.component.html',
  styleUrls: ['./c-credit-registering.component.scss'],
  standalone: true,
  imports: [
    UiAnimatedSwitchComponent,
    CreditRegisterBenefitsComponent,
    NgIf,
    CreditCalculatorV3Component,
    NgFor,
    UiComplexAccordionComponent,
    CCreditMapsComponent,
  ],
})
export class CCreditRegisteringComponent implements OnInit {
  @Input() CCreditRegisteringData: Registering;

  selectedRegisterPath: StyledSwitchOption;

  animatedHeight: number;

  animatedOptions: Array<StyledSwitchOption> = [];

  @Input() certainFundProviderCode: number;

  certainCollateral: string;

  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private creditCalculatorService: CreditCalculatorService,
  ) {}

  ngOnInit(): void {
    this.initializeAnimatedSwitch();
    this.route.queryParams.subscribe((params) => {
      if (params.fundProvider && params.collateralType) {
        this.certainFundProviderCode = this.creditCalculatorService.fundProviders.find(
          (o) => o.fundProviderName === params.fundProvider,
        )?.fundProviderCode;
        this.certainCollateral = params.collateralType.toUpperCase();
      }
    });
  }

  changeTab(selectedOption: StyledSwitchOption) {
    this.selectedRegisterPath = selectedOption;
  }

  initializeAnimatedSwitch() {
    this.setAnimatedSwitchHeightSubscribe();
    this.initializeAnimatedSwitchOptions();
  }

  setAnimatedSwitchHeightSubscribe() {
    this.layoutService.screenSizeChanged.subscribe((value) => {
      if (value === ScreenSize.isDesktop) {
        this.animatedHeight = 51;
      } else if (value === ScreenSize.isTablet) {
        this.animatedHeight = 45;
      } else {
        this.animatedHeight = 42;
      }
    });
  }

  initializeAnimatedSwitchOptions() {
    this.fillAnimatedSwitchOptions();
    this.setDefaultSelectedRegisterPath();
  }

  fillAnimatedSwitchOptions() {
    this.animatedOptions.push(this.convertToStyledSwitchOption(this.CCreditRegisteringData.onlineRegister.registerType, 0));
    this.animatedOptions.push(this.convertToStyledSwitchOption(this.CCreditRegisteringData.inPersonRegister.registerType, 1));
  }

  setDefaultSelectedRegisterPath() {
    this.route.queryParams.subscribe((params) => {
      if (params.selectedRegisterPath) {
        this.selectedRegisterPath = this.animatedOptions[params.selectedRegisterPath];
      } else if (this.animatedOptions.length > 0) {
        this.selectedRegisterPath = this.animatedOptions[0];
      }
    });
  }

  convertToStyledSwitchOption(title: string, value: number) {
    return {
      label: title,
      value: value,
      backgroundColor: '#F0F5FF',
      borderColor: '#0040FF',
    };
  }
}
