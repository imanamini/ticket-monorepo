import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { FeatureCards } from '../../../../../../api/clients/models/templates/ipg/feature-cards';
import { Benefits } from '../../../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { TempFeatureCardProxy } from '../../../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../../services/layout.service';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiValueSimpleComponent } from '../../../../../../ui/ui-components/ui-value-cards/ui-value-simple/ui-value-simple.component';
import { NgIf } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-working-capital-onboarding',
  templateUrl: './working-capital-onboarding.component.html',
  styleUrls: ['./working-capital-onboarding.component.scss'],
  standalone: true,
  imports: [NgIf, UiValueSimpleComponent, UiButtonComponent, NgxIcon],
})
export class WorkingCapitalOnboardingComponent implements OnInit, OnDestroy {
  helps!: Benefits;

  features: FeatureCards[] = [];
  subscription: Subscription;

  constructor(
    private dialog: DialogBottomSheetService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    private layoutService: LayoutService,
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.helps = value ? bottomSheetData.data.onboarding : dialogData.data.onboarding;
    });
  }

  ngOnInit(): void {
    if (this.helps && this.helps.items && this.helps.items.length > 0) {
      for (let i = 0; i < this.helps.items.length; ++i) {
        const x = new TempFeatureCardProxy(this.helps.items[i]).newFeatureCard;
        this.features.push(x);
      }
    }
  }

  closeDialog() {
    this.dialog.close(false);
  }

  submit() {
    this.dialog.close(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
