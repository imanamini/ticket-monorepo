import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { CreditCampaignTemplate } from '../../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { DomSanitizer } from '@angular/platform-browser';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { Subject, takeUntil, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-credit-campaign-timer',
  templateUrl: './credit-campaign-timer.component.html',
  styleUrls: ['./credit-campaign-timer.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, NgOptimizedImage, UiIconDirective, NgClass],
})
export class CreditCampaignTimerComponent implements OnInit, OnDestroy {
  @Input()
  templateData!: CreditCampaignTemplate | any;
  @Input() showDent = true;
  @Input() digijet = false;
  @Input() B20Mode = false;

  @Input()
  scrollToElementId: string;

  @Input() scrollAnchor = 'campaign-form';
  @Input() block: 'start' | 'end' | 'center' | 'nearest' = 'center';

  @Output() clickEmit = new EventEmitter<any>();

  timer: any = {};

  private destroy$ = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const countDownDate = this.templateData?.sectionCounter?.counter?.deadline;
      if (countDownDate) {
        timer(0, 1000)
          .pipe(
            map(() => {
              const now = new Date().getTime();
              const timeLeft = countDownDate - now;
              return {
                days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
                hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
              };
            }),
            takeUntil(this.destroy$),
          )
          .subscribe((time) => {
            this.timer = time;
          });
      }
    }
  }
  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ block: 'center', inline: 'center' });
    }
  }

  emitClick() {
    if (!this.templateData.sectionCounter?.firstCta?.link) {

      this.scrollToElement(this.scrollAnchor);
    } else {

      this.clickEmit.emit();
    }


  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
