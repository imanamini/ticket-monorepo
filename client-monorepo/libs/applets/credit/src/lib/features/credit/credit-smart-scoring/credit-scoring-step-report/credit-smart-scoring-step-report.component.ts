import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditSmartScoringStepScoreDetailsComponent } from './credit-smart-scoring-step-score-details/credit-smart-scoring-step-score-details.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import html2canvas from 'html2canvas';
import { convertEnglishDigitsToPersian } from '@digipay/strings';
import { CreditSmartScoreStepLoanItemComponent } from './credit-smart-score-step-loan-item/credit-smart-score-step-loan-item.component';
import { CreditLocationTrapComponent } from '../../components/credit-location-trap/credit-location-trap.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditReportResponse } from '../../data-access/models/credit-scoring/credit-report-response';
import { CreditScoringApiService } from '../../data-access/services/credit-scoring-api.service';
import { CreditSmartScoringStepReportScoreBoxNewComponent } from './credit-smart-scoring-step-report-score-box-new/credit-smart-scoring-step-report-score-box-new.component';
import { CreditSmartScoringStepReportSkeletonComponent } from './credit-smart-scoring-step-report-skeleton/credit-smart-scoring-step-report-skeleton.component';

@Component({
  selector: 'app-credit-smart-scoring-step-report',
  templateUrl: './credit-smart-scoring-step-report.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-scoring-step-report.component.scss'],
  imports: [
    CreditLocationTrapComponent,
    PipesModule,
    NgxDividerComponent,
    NgxCalloutComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxStatusResultModule,
    CreditSmartScoreStepLoanItemComponent,
    CreditSmartScoringStepReportScoreBoxNewComponent,
    CreditSmartScoringStepReportSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepReportComponent implements OnInit {
  reportErrorButtons: Buttons[] = [
    {
      id: 'scoringReportRetryButton',
      label: 'تلاش دوباره',
      style: 'tinted-on-elevated',
      mode: 'section',
    },
  ];
  trackingCode = model<string>();
  type = input<'without-pay' | 'with-pay'>('with-pay');
  report = signal<CreditReportResponse | null>(null);
  reportError = signal(false);
  downloading = signal(false);
  back = output<void>();

  reportContent = viewChild<ElementRef>('reportContent');

  activatedRoute = inject(ActivatedRoute);
  creditScoringApiService = inject(CreditScoringApiService);
  bottomSheetService = inject(NgxBottomSheetService);
  protected readonly Object = Object;

  isNoData = computed(() => {
    const score = this.report()?.summary?.score;
    return score !== undefined ? score <= 0 : true;
  });

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.reportError.set(false);
    this.creditScoringApiService.getReportDetail(this.trackingCode()!, null, this.type()).subscribe({
      next: (data) => {
        this.report.set(data);
      },
      error: () => {
        this.reportError.set(true);
      },
    });
  }

  async DownloadReport() {
    this.downloading.set(true);
    await document.fonts.ready;
    html2canvas(this.reportContent()!.nativeElement, {
      scale: 1,
      useCORS: true,
      onclone: (clonedDoc, element) => {
        const icons = clonedDoc.querySelectorAll('[class*="icon-"]');
        icons.forEach((icon) => icon.classList.add('d-none'));
        const uls = clonedDoc.querySelectorAll('ul');
        uls.forEach((ul) => {
          ul.style.cssText = `
          list-style: none !important;
          padding-right: 0 !important;
          direction: rtl !important;
        `;
        });

        const lis = clonedDoc.querySelectorAll('li');
        lis.forEach((li) => {
          li.style.cssText = `
          list-style: none !important;
          padding-right: 0 !important;
        `;
        });
        this.replaceDigitsRecursively(element);
      },
    }).then(async (canvas) => {
      const imageData = canvas.toDataURL('image/png', 5.0);
      const blob = await (await fetch(imageData)).blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Digipay-ics-report-${new Date().toLocaleString()}.png`;
      a.click();
      this.downloading.set(false);
    });
  }

  replaceDigitsRecursively(el: HTMLElement) {
    if (el.childNodes) {
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = convertEnglishDigitsToPersian(node.textContent || '');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          this.replaceDigitsRecursively(node as HTMLElement);
        }
      });
    }
  }

  goToScoreDetails() {
    this.bottomSheetService.openBottomSheet(
      CreditSmartScoringStepScoreDetailsComponent,
      {
        summary: this.report()?.summary,
      },
      { noPadding: true },
    );
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly close = close;
}
