import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { InsurancePlansTypes } from '../../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { StyledSwitchOption } from '../../../../../ui/models/switch-option.model';
import { LayoutService } from '../../../../services/layout.service';
import { ScreenSize } from '../../../../../api/digipay/models/common/screen-size';
import { UiDialogCreditHintsComponent } from '../../../../../ui/ui-components/ui-credit/ui-dialog-credit-hints/ui-dialog-credit-hints.component';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { UiAnimatedSwitchComponent } from '../../../../../ui/ui-components/ui-switch/ui-animated-switch/ui-animated-switch.component';

@Component({
  selector: 'app-credit-plans-types',
  templateUrl: './credit-plans-types.component.html',
  styleUrls: ['./credit-plans-types.component.scss'],
  standalone: true,
  imports: [UiAnimatedSwitchComponent, NgFor, NgClass, NgIf, UiButtonComponent],
})
export class CreditPlansTypesComponent implements OnInit, AfterViewInit {
  animatedOptions: Array<StyledSwitchOption> = [];

  animatedHeight: number;

  @Input()
  creditInsurancePlansTypesData!: InsurancePlansTypes;

  selectedOptionIndex = 0;

  selectedOption: StyledSwitchOption;

  readMore = false;

  constructor(
    private layoutService: LayoutService,
    private dialog: DialogBottomSheetService,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < this.creditInsurancePlansTypesData.insurancePlans.length; ++i) {
      this.animatedOptions.push(this.convertToStyledSwitchOption(this.creditInsurancePlansTypesData.insurancePlans[i], i));
    }
    if (this.creditInsurancePlansTypesData.insurancePlans.length > 0) {
      this.selectedOption = this.convertToStyledSwitchOption(this.creditInsurancePlansTypesData.insurancePlans[0], 0);
    }
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

  changeTab(selectedOption: StyledSwitchOption) {
    this.selectedOptionIndex = selectedOption.value;
    this.selectedOption = selectedOption;
  }

  changeReadMoreState() {
    this.readMore = !this.readMore;
  }

  convertToStyledSwitchOption(option: any, value: number) {
    return {
      label: option.title,
      value: value,
      backgroundColor: '#F0F5FF',
      borderColor: '#0040FF',
    };
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('hint-text');
      const anchorTag = element.getElementsByTagName('a');
      anchorTag[0].onclick = (event) => {
        event.preventDefault();
        this.openModal();
      };
    }
  }

  openModal() {
    this.dialog.open(UiDialogCreditHintsComponent, {
      width: '650px',
      data: {
        templateData: this.creditInsurancePlansTypesData.insurancePlans[this.selectedOptionIndex].content.hints.items[0].modalData,
      },
    });
  }
}
