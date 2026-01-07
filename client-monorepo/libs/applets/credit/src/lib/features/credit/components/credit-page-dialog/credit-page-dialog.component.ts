import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { BaseApiService } from '../../data-access/services/base-api.service';
import { CreditCacheService } from '../../data-access/services/credit-cache.service';
import { fixWebViewHtml } from '../../data-access/utils/strings';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditPageLoadingComponent } from '../credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-page-dialog',
  templateUrl: './credit-page-dialog.component.html',
  styleUrls: ['./credit-page-dialog.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditPageLoadingComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPageDialogComponent implements OnInit {
  title = signal<string | null>(null);
  pageId: string;

  relativeUrl: string;

  absoluteUrl = signal<string | null>(null);

  safeAbsoluteUrl = signal<SafeResourceUrl | null>(null);

  gettingContent = signal(false);

  htmlContent = signal<SafeHtml | null>(null);

  html: string | null = null;

  iframeLoading = signal(true);

  confirmButton = signal<string | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);
  apiService = inject(BaseApiService);
  sanitizer = inject(DomSanitizer);
  cache = inject(CreditCacheService);

  constructor() {
    this.title.set(this.bottomSheetService.data().title);
    this.pageId = this.bottomSheetService.data().pageId;
    this.relativeUrl = this.bottomSheetService.data().relativeUrl;
    this.absoluteUrl.set(this.bottomSheetService.data().absoluteUrl);
    this.confirmButton.set(this.bottomSheetService.data().confirmButton);
    if (this.bottomSheetService.data().html) {
      this.html = this.bottomSheetService.data().html;
    }
  }

  ngOnInit(): void {
    this.getPageContent();
  }

  /**
   * since API doest not allow viewing the pages using iFrame,
   * we should take pages content (HTML) and pass it into
   * `srcdoc` attribute of the iframe
   */
  getPageContent(): void {
    if (this.absoluteUrl()) {
      this.safeAbsoluteUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.absoluteUrl()!));
      this.gettingContent.set(false);
      return;
    }

    if (this.html) {
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(this.html)));
      this.gettingContent.set(false);
      return;
    }

    if (this.pageId) {
      const ck = this.pageId + '_page_cache';

      if (!this.cache.has(ck)) {
        this.gettingContent.set(true);

        this.apiService.getPage(this.pageId).subscribe({
          next: (html) => {
            this.gettingContent.set(false);
            this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(html)));
            this.cache.put(ck, this.htmlContent());
          },
          error: () => {
            this.gettingContent.set(false);
          },
        });
      } else {
        this.htmlContent.set(this.cache.get(ck));
      }
      return;
    }

    if (this.relativeUrl) {
      this.apiService.getHtml(this.relativeUrl).subscribe((html) => {
        this.gettingContent.set(false);
        this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(html)));
      });
      return;
    }
    this.gettingContent.set(false);
  }

  closeButton(): void {
    this.bottomSheetService.outputData.set({
      closed: true,
    });
    this.close();
  }

  onConfirm() {
    this.bottomSheetService.outputData.set({
      closed: true,
      confirmed: true,
    });
    this.close();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
