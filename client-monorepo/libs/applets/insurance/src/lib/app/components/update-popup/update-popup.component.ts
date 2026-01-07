import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';

@Component({
  selector: 'update-popup',
  standalone: true,
  imports: [
    ActionButtonsComponent
  ],
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.scss'
})
export class UpdatePopupComponent {
  private bottomSheetRef = inject(MatBottomSheetRef<UpdatePopupComponent>);
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  handleActiveButtonClicked(): void {
    this.bottomSheetRef.dismiss(true);
  }
}
