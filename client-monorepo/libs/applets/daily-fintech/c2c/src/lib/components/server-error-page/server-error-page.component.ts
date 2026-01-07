import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'c2c-applet-server-error-page',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './server-error-page.component.html',
  styleUrls: ['./server-error-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorPageComponent {
  title = input('اشکال در ارتباط با سرور');
  description = input('');
  try = output<void>();

  retry() {
    this.try.emit();
  }
}
