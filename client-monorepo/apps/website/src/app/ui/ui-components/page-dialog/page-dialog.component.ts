import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseHttpClient } from '../../../api/base-http-client';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { fixWebViewHtml } from '../form-field-builder/utils/strings';

@Component({
  selector: 'app-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrls: ['./page-dialog.component.scss'],
})
export class PageDialogComponent implements OnInit {
  title: string;

  pageId: string;

  gettingContent = false;

  _html: SafeHtml;

  html: string = null;

  constructor(
    private apiService: BaseHttpClient,
    private sanitizer: DomSanitizer,
    private memoryCacheService: MemoryCacheService,
    private dialogRef: MatDialogRef<PageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.apiService.api = 'digipay';
    this.title = this.dialogData.title;
    this.pageId = this.dialogData.pageId;
    if (this.dialogData.html) {
      this.html = this.dialogData.html;
    }
    this.dialogRef.addPanelClass('page-dialog-component');
  }

  ngOnInit() {
    this.getPageContent();
  }

  /**
   * since API doest not allow viewing the pages using iFrame,
   * we should take pages content (HTML) and pass it into
   * `srcdoc` attribute of the iframe
   */
  getPageContent() {
    if (this.html) {
      this._html = this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(this.html));
      this.gettingContent = false;
    } else {
      const ck = this.pageId + '_page_cache';

      if (!this.memoryCacheService.has(ck)) {
        this.gettingContent = true;

        this.apiService.getPageFile(this.pageId).subscribe(
          (html) => {
            this.gettingContent = false;
            this._html = this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(html));

            this.memoryCacheService.put(ck, this._html);
          },
          (e) => {
            this.gettingContent = false;
          },
        );
      } else {
        this._html = this.memoryCacheService.get(ck);
      }
    }
  }

  closeButton() {
    this.dialogRef.close({
      closed: true,
    });
  }
}
