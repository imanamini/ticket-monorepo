import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'lib-native-version-toast',
  standalone: true,
  imports: [NgxButtonComponent, ApiImageModule],
  templateUrl: './native-version-toast.component.html',
  styleUrl: './native-version-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeVersionToastComponent {
  title = input('نسخه‌ی جدید اندرویدی موجود است!');
  description = input('جهت دریافت آن، روی دکمه کلیک کنید');
  ctaText = input('دریافت');

  onCtaClicked = output<boolean>();

  onClicked(): void {
    this.onCtaClicked.emit(true);
  }
}
