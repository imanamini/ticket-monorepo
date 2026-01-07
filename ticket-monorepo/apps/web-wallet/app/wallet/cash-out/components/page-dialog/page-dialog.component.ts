import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { isMobileDevice } from '../../../../utils/device';
import {FileApiService} from "../../services/file-api.service";
import {UiSpinnerComponent} from "../ui-spinner/ui-spinner.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrls: ['./page-dialog.component.scss'],
  imports: [
    UiSpinnerComponent,
    NgIf
  ],
  standalone: true
})
export class PageDialogComponent {

  title: string;

  pageId: string;

  gettingContent = false;

  safeHtml: SafeHtml;

  html: string = null;

  constructor(
    private sanitizer: DomSanitizer,
    private fileApi: FileApiService,
    private cache: MemoryCacheService,
    private dialogRef: MatDialogRef<PageDialogComponent>,
    private bottomSheetRef: MatBottomSheetRef<PageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
  ) {
    this.addTitle();
    this.addHtml();
    this.addPageId();
    this.getPageContent();
  }

  /**
   * since API doest not allow viewing the pages using iFrame,
   * we should take pages content (HTML) and pass it into
   * `srcdoc` attribute of the iframe
   */
  getPageContent(): void {

    if (this.html) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.fixWebViewHtml(this.html));
      this.gettingContent = false;

    } else {
      const ck = this.pageId + '_page_cache';

      if (!this.cache.has(ck)) {
        this.gettingContent = true;

        this.fileApi.getPage(this.pageId).subscribe(html => {
          this.gettingContent = false;
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.fixWebViewHtml(html));
          this.cache.put(ck, this.safeHtml);

        }, e => {
          this.gettingContent = false;
        });
      } else {
        this.safeHtml = this.cache.get(ck);
      }
    }
  }

  fixWebViewHtml(html: string): any {
    return html.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`);
  }

  closeButton(): void {
    if (isMobileDevice()) {
      this.bottomSheetRef.dismiss({
        closed: true
      });
      return;
    }
    this.dialogRef.close({
      closed: true
    });
  }

  private addTitle() {
    this.title = this.dialogData.title || this.bottomSheetData.title;
  }

  private addHtml() {
    if (this.dialogData.html || this.bottomSheetData.html) {
      this.html = this.dialogData.html || this.bottomSheetData.html;
    }
  }

  private addPageId() {
    this.pageId = this.dialogData.pageId || this.bottomSheetData.pageId;
  }

}
