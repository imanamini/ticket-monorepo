import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgClass, NgIf } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { fixWebViewHtml } from '../../../data-access/utils/strings';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'cash-out-applet-conditions-dialog',
  templateUrl: 'conditions.dialog.html',
  styleUrls: ['conditions.dialog.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgClass, NgxButtonComponent],
})
export class ConditionsDialogComponent implements OnInit {
  html = signal<SafeHtml | null>(null);

  ts = new Date();

  isLoaded = signal(false);

  shouldConfirm = false;
  private bottomSheet = inject(NgxBottomSheetService)
  data: any

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
  ) {
    this.data = this.bottomSheet.data().data
    if (this.data && this.data.shouldConfirm) {
      this.shouldConfirm = true;
    }
  }

  ngOnInit(): void {
    const request = new RequestBuilder(RequestTypeEnum.GET_PAGE, 'files/tac');
    this.apiService.call(request).subscribe((html) => {
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(html)));
      this.isLoaded.set(true);
    });
  }

  accept() {
    this.bottomSheet.outputData.set(true)
    this.bottomSheet.closeBottomSheet();
  }
}
