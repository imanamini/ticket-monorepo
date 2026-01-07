import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CreditApiService } from '../../../../api/credit-api.service';
import { CreditPayService } from '../../../../shared/services/credit-pay.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScrollableViewComponent } from '../../../../shared/components/scrollable-view/scrollable-view.component';

@Component({
  selector: 'app-sign-contract',
  templateUrl: './sign-contract.component.html',
  styleUrls: ['./sign-contract.component.scss'],
})
export class SignContractComponent implements OnInit {

  @ViewChild('tooltip') btnTooltip: MatTooltip;

  @ViewChildren('frame') frameRef: QueryList<ElementRef<HTMLIFrameElement>>;

  @ViewChildren('scroller') scrollRef: QueryList<ScrollableViewComponent>;

  checked: boolean;
  checkDisabled: boolean = false;
  gettingData: boolean;
  creditId: string;
  creditAmount: number;
  iframeLoading = true;
  htmlContent: SafeHtml;

  constructor(
    private creditApiService: CreditApiService,
    private payService: CreditPayService,
    private sanitizer: DomSanitizer,
    private ref: MatBottomSheetRef<SignContractComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { creditId: string, creditAmount: number },
  ) {
    this.creditId = data.creditId;
    this.creditAmount = data.creditAmount;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.gettingData = true;
    this.creditApiService.getPurchaseContract(this.creditId, this.creditAmount).subscribe({
      next: html => {
        this.gettingData = false;
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
        setTimeout(() => {
          const element = this.frameRef.first.nativeElement;
          const iframeBodyHeight = element.contentWindow.document.body.scrollHeight;
          element.style.height = iframeBodyHeight + 'px';
        }, 1000);
      },
      error: error => {
        this.gettingData = false;
        this.ref.dismiss();
        this.payService.goToErrorPageByErrorResponse(error);
      }
    });
  }

  handleCheckbox(event: boolean) {
    if (!this.checked) {
      this.checkDisabled = true;
      this.scrollToBottom().then(res => {
        this.checked = true;
        this.checkDisabled = false;
      });
    } else {
      this.checked = false;
    }
  }

  onClick() {
    if (!this.checked) {
      this.btnTooltip.show();
    } else {
      this.ref.dismiss({signed: true, pay: true});
    }
  }

  closeContract() {
    if (this.checked) {
      return;
    }
    this.ref.dismiss({signed: this.checked, pay: false});
  }

  private scrollToBottom(): Promise<void> {
    return new Promise((resolve) => {
      const scrollableViewComponent = this.scrollRef.first;
      if (!scrollableViewComponent) {
        resolve();
        return;
      }

      // Access the scrollable container from the ScrollableViewComponent's ElementRef
      const scrollElement = scrollableViewComponent['elementRef']?.nativeElement?.querySelector('.scrollable-container');

      if (!scrollElement) {
        resolve();
        return;
      }

      const start = scrollElement.scrollTop;
      const end = scrollElement.scrollHeight - scrollElement.clientHeight;
      const distance = end - start;
      const duration = 1000; // 1 second
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        scrollElement.scrollTop = start + (distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }
}
