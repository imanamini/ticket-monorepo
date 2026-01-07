import { Component, inject, signal } from '@angular/core';
import { FlokiHeaderComponent } from '../../../../ui-component/floki-header/floki-header.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ImageGuideComponent } from '../image-guide/image-guide.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'screen-guide',
  standalone: true,
  imports: [
    FlokiHeaderComponent,
    NgxButtonComponent,
    ImageGuideComponent
  ],
  templateUrl: './screen-guide.component.html',
  styleUrl: './screen-guide.component.scss'
})
export class ScreenGuideComponent {
  sheet = inject(MatBottomSheet);

  closeBottomSheet(): void {
    this.sheet.dismiss();
  }
}
