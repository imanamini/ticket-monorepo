import { Component, Input } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-credit-page-loading',
  templateUrl: './credit-page-loading.component.html',
  styleUrls: ['./credit-page-loading.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, NgxSpinnerModule],
})
export class CreditPageLoadingComponent {
  @Input()
  active = false;

  @Input()
  height: string;

  getStyles() {
    const styles: any = {};

    if (this.height) {
      styles.height = this.height;
    }

    return styles;
  }
}
