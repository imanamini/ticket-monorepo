import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'app-credit-no-service-dialog',
  templateUrl: './credit-no-service-dialog.component.html',
  styleUrls: ['./credit-no-service-dialog.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditNoServiceDialogComponent implements OnInit {
  title = signal<string | null>(null);
  message = signal<string | null>(null);
  staticImage = signal<'no-service' | 'error' | 'warning' | 'in-progress' | 'failed' | null>(null);
  primaryCta = signal<string | null>(null);
  secondaryCta = signal<string | null>(null);
  pageTitle = signal<string | null>(null);
  /*
    ctaPriority high: primary button is blue, and secondary button is light blue
    ctaPriority low: primary button is light-blue and secondary button is gray link
   */
  notBlocker = signal<boolean | null>(null);
  buttons = signal<Buttons[]>([]);

  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    this.title.set(this.bottomSheetService.data().title);
    this.message.set(this.bottomSheetService.data().message);
    this.staticImage.set(this.bottomSheetService.data().staticImage);
    this.primaryCta.set(this.bottomSheetService.data().primaryCta);
    this.secondaryCta.set(this.bottomSheetService.data().secondaryCta);
    this.notBlocker.set(!!this.bottomSheetService.data().notBlocker);
  }

  ngOnInit(): void {
    if (this.secondaryCta()) {
      this.buttons.update((buttons) => [
        ...buttons,
        {
          label: this.secondaryCta()!,
          id: 'secondary',
          style: 'fill',
          mode: 'section',
        },
      ]);
    }

    if (this.primaryCta()) {
      this.buttons.update((buttons) => [
        ...buttons,
        {
          label: this.primaryCta()!,
          id: 'primary',
          style: this.secondaryCta() ? 'link' : 'fill',
          mode: 'section',
        },
      ]);
    }
  }

  checkWhatButtonClicked(id: string) {
    if (id === 'primary') {
      this.onPrimaryCtaClick();
      return;
    }

    if (id === 'secondary') {
      this.onSecondaryCtaClick();
      return;
    }
  }

  onSecondaryCtaClick() {
    this.bottomSheetService.outputData.set({ secondary: true });
    this.close();
  }

  onPrimaryCtaClick() {
    this.bottomSheetService.outputData.set({ primary: true });
    this.close();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
