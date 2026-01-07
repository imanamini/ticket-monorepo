import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'fullscreen-loading',
  standalone: true,
  imports: [
    NgxSpinnerModule
  ],
  templateUrl: './fullscreen-loading.component.html',
  styleUrl: './fullscreen-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenLoadingComponent {
  message = input<string>();
}
