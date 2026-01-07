import { Component, inject, OnInit, signal } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-pre-register-notice',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './pre-register-notice.component.html',
  styleUrl: './pre-register-notice.component.scss',
})
export class PreRegisterNoticeComponent implements OnInit {
  loading = signal<boolean>(false);
  ipoName = signal<string | undefined>(undefined);

  private bottomSheet = inject(NgxBottomSheetService);

  ngOnInit() {
    this.ipoName.set(this.bottomSheet.data().ipo.name);
  }

  action() {
    this.loading.set(true);
    this.bottomSheet.outputData.set({ continue: true });
    this.bottomSheet.closeBottomSheet();
  }
}
