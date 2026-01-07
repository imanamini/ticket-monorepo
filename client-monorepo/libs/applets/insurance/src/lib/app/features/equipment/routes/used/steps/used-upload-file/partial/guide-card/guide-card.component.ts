import { Component, input } from '@angular/core';
import {
  PreviewComponent
} from '../../../../../../../../components/ui-upload-file/partial/preview/preview.component';
import { MatDialog } from '@angular/material/dialog';
import { GuideCardModel } from '../../model/guide-card.model';

@Component({
  selector: 'guide-card',
  standalone: true,
  imports: [],
  templateUrl: './guide-card.component.html',
  styleUrl: './guide-card.component.scss'
})
export class GuideCardComponent {

  constructor(private dialog: MatDialog) {
  }

  config = input<GuideCardModel>();

  previewImageLarge(): void {
    this.dialog.open(PreviewComponent, {
      data: {
        srcUrl: this.config()?.src
      }
    });
  }

}
