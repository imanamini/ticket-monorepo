import { Component, effect, Inject, input, OnDestroy, output, PLATFORM_ID } from '@angular/core';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-dialog-base',
  templateUrl: './ui-dialog-base.component.html',
  styleUrls: ['./ui-dialog-base.component.scss'],
  standalone: true,
  imports: [NgClass, UiButtonComponent],
})
export class UiDialogBaseComponent implements OnDestroy {
  confirmText = input<string>('');
  rejectText = input<string>('');
  dialogTitle = input<string>('');
  invertColors = input<boolean>(false);
  alignCenterTitle = input<boolean>(false);

  confirmed = output<void>();
  rejected = output<void>();

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
    // Effect to handle body class for dialog open
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.add('ui-dialog-open');
      }
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('ui-dialog-open');
    }
  }

  onReject($event: Event): void {
    this.rejected.emit();
  }

  onConfirm($event: Event): void {
    this.confirmed.emit();
  }
}
