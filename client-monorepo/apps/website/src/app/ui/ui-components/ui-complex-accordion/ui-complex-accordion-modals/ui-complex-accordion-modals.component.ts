import {Component, Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {LayoutService} from '../../../../website/services/layout.service';
import {DialogBottomSheetService} from '../../../../core/services/dialog-bottom-sheet.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {UiButtonComponent} from '../../ui-button/ui-button/ui-button.component';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {UiIconDirective} from '../../../ui-directive/ui-icon.directive';
import {NgxIcon} from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-complex-accordion-modals',
  templateUrl: './ui-complex-accordion-modals.component.html',
  styleUrls: ['./ui-complex-accordion-modals.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgFor, UiButtonComponent, UiIconDirective, NgxIcon],
})
export class UiComplexAccordionModalsComponent {
  data: any;

  subscription: Subscription;

  isVideo = false;

  constructor(
    private layoutService: LayoutService,
    private dialog: DialogBottomSheetService,
    @Inject(MAT_DIALOG_DATA) public dialogData,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData,
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.data = !value ? this.dialogData.modal : this.bottomSheetData.modal;
    });
  }

  ngAfterContentChecked() {
    const video = document.getElementsByTagName('video');
    if (video.length) {
      this.isVideo = true;
    }
  }

  buttonClick(link: string) {
    if (link) {
      window.location.href = link;
    } else {
      this.closeDialog();
    }
  }

  closeDialog() {
    this.dialog.close();
  }
}
