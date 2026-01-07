import { Component, Input } from '@angular/core';
import { Banner } from '../../../../api/clients/models/content/banner';
import { ModalBanner } from '../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { MatDialog } from '@angular/material/dialog';
import { UiDialogTopBannerComponent } from '../../ui-dialogs/ui-dialog-top-banner/ui-dialog-top-banner.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-banner',
  templateUrl: './ui-banner.component.html',
  styleUrls: ['./ui-banner.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class UiBannerComponent {
  @Input()
  banner!: Banner;

  @Input()
  modalBanner!: ModalBanner;

  constructor(private matDialog: MatDialog) {}

  openDialog() {
    this.matDialog.open(UiDialogTopBannerComponent, {
      width: '512px',
      data: {
        templateData: this.modalBanner,
      },
    });
  }
}
