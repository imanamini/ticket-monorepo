import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'taxi-applet-error-page',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './taxi-error-page.component.html',
  styleUrl: './taxi-error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxiErrorPageComponent {
  @Input() title!: string;

  @Input() description!: string;

  @Input() btnRightText = 'اسکن مجدد کد';

  @Input() btnLeftText = 'بازگشت به خانه';

  @Input() defaultActions = true;

  @Output() clickRightButton = new EventEmitter();

  @Output() clickLeftButton = new EventEmitter();

  constructor(private router: Router) {}

  onClickRightButton(): void {
    if (this.defaultActions) {
      this.router.navigate(['qr']).then();
      return;
    }
    this.clickRightButton.emit();
  }

  onClickLeftButton(): void {
    if (this.defaultActions) {
      this.router.navigate(['']).then();
      return;
    }
    this.clickLeftButton.emit();
  }
}
