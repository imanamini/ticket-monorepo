import { Component, Input } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-credit-plans-loading',
  templateUrl: './credit-plans-loading.component.html',
  styleUrls: ['./credit-plans-loading.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, NgxSpinnerModule],
})
export class CreditPlansLoadingComponent {
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
