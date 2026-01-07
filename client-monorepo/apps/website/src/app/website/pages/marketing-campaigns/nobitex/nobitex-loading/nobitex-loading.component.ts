import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NobitexCreditService } from '../../../../../api/clients/nobitex/nobitex-credit.service';
import { NgxProgressBarComponent, ProgressBarTypeTranslator } from '@digipay/ngx-progress-bar';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nobitex-loading',
  templateUrl: './nobitex-loading.component.html',
  styleUrls: ['./nobitex-loading.component.scss'],
  standalone: true,
  imports: [NgxProgressBarComponent, AsyncPipe],
})
export class NobitexLoadingComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    protected nobitexCredit: NobitexCreditService,
  ) {}

  get progressValue() {
    return this.nobitexCredit.progressValue;
  }

  protected readonly ProgressBarTypeTranslator = ProgressBarTypeTranslator;
}
