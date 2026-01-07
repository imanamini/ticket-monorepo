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
import { CreditReportResponse } from '../../../data-access/models/credit-scoring/credit-report-response';
import { CreditScoringApiService } from '../../../data-access/services/credit-scoring-api.service';
import { CreditLocationTrapComponent } from '../../../components/credit-location-trap/credit-location-trap.component';
import { CreditScoringStepReportSkeletonComponent } from './credit-scoring-step-report-skeleton/credit-scoring-step-report-skeleton.component';
import { CreditScoreStepLoanItemComponent } from './credit-score-step-loan-item/credit-score-step-loan-item.component';
import { CreditScoringStepScoreDetailsComponent } from './credit-scoring-step-score-details/credit-scoring-step-score-details.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditScoringStepReportScoreBoxNewComponent } from './credit-scoring-step-report-score-box-new/credit-scoring-step-report-score-box-new.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import html2canvas from 'html2canvas';
import { convertEnglishDigitsToPersian } from '@digipay/strings';
import { CreditDigikalaService } from '../../../data-access/services/pillar/credit-digikala.service';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'app-credit-scoring-step-report',
  templateUrl: './credit-scoring-step-report.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-step-report.component.scss'],
  imports: [
    CreditLocationTrapComponent,
    CreditScoringStepReportSkeletonComponent,
    CreditScoreStepLoanItemComponent,
    PipesModule,
    NgxDividerComponent,
    NgxCalloutComponent,
    CreditScoringStepReportScoreBoxNewComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxStatusResultModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepReportComponent implements OnInit {
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
  creditDigikalaService = inject(CreditDigikalaService);
  gtmService = inject(NgxEventTrackerService);
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
    this.sendEvent();
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
      const link = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = link;
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
      CreditScoringStepScoreDetailsComponent,
      {
        summary: this.report()?.summary,
      },
      { noPadding: true },
    );
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;

  private sendEvent(): void {
    const eventData = {
      event: 'CREDIT_SCORING_REPORT_DOWNLOAD',
      pageName: 'credit-scoring-report',
    };
    this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
  }
}
