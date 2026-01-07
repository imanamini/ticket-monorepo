import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-feedback-message',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxButtonComponent],
  templateUrl: './feedback-message.component.html',
  styleUrl: './feedback-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackMessageComponent {
  mode = signal('');

  bottomSheetService = inject(NgxBottomSheetService);
  router = inject(Router);

  constructor() {
    this.mode.set(this.bottomSheetService.data().mode);
  }

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
    this.router.navigate(['/profile']);
  }
}
