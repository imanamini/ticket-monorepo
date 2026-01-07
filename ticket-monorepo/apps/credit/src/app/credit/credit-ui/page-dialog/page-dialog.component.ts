import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fixWebViewHtml } from '../../../utils/strings';
import { CreditApiService } from '../../api/credit-api.service';

@Component({
  selector: 'app-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrls: ['./page-dialog.component.scss']
})
export class PageDialogComponent implements OnInit {

  title: string;

  gettingContent: boolean = false;

  relativeUrl: string;

  html: string;

  _html: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PageDialogComponent>,
    private creditApiService: CreditApiService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.title = this.dialogData.title;
    this.relativeUrl = this.dialogData.relativeUrl;
    if (this.dialogData.html) {
      this.html = this.dialogData.html;
    }
  }

  ngOnInit() {
    this.getPageContent();
  }

  getPageContent() {

    if (this.html) {

      this._html = this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(this.html));
      this.gettingContent = false;
      return;

    }

    if (this.relativeUrl) {
      this.gettingContent = true;

      this.creditApiService.getHtml(this.relativeUrl).subscribe(html => {

        this.gettingContent = false;
        this._html = this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(html));

      }, e => {

        this.gettingContent = false;
      });
      return;
    }
    this.gettingContent = false;
  }

  closeButton() {
    this.dialogRef.close({
      closed: true
    });
  }

}
