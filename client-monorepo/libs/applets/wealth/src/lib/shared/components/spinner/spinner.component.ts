import { Component, Input } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule],
})
export class SpinnerComponent {
  @Input()
  title?: string;

  @Input()
  subtitle?: string;

  @Input()
  size = 24;

  @Input()
  opacity = 0.3;
}
