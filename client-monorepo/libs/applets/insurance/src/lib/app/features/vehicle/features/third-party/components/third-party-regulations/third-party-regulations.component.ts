import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import {
  ActionButtonsComponent
} from '../../../../../../components/action-buttons/action-buttons.component';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';

@Component({
  selector: 'third-party-regulations',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    InsButtonComponent
  ],
  templateUrl: './third-party-regulations.component.html',
  styleUrl: './third-party-regulations.component.scss'
})
export class ThirdPartyRegulationsComponent extends BaseComponent {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ThirdPartyRegulationsComponent>,
  ) {
    super();
  }

  handleActiveButtonClicked(): void {
    this.bottomSheetRef.dismiss();
  }
}
