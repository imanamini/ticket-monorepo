import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fixWebViewHtml } from '../../../utils/strings';

@Component({
  selector: 'app-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrls: ['./page-dialog.component.scss']
})
export class PageDialogComponent implements OnInit {

  title: string;

  gettingContent = false;

  _html: SafeHtml;

  html: string = null;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.title = this.dialogData.title;
    if (this.dialogData.html) {
      this.html = this.dialogData.html;
    }
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
    this._html = this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(this.html));
    this.gettingContent = false;
  }

  closeButton() {
    this.dialogRef.close({
      closed: true
    });
  }
}
