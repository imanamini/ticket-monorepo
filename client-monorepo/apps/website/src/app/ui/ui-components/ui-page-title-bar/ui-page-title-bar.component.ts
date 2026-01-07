import { Component, DoCheck, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ExternalService } from './external.service';
import { shouldGoToPreviousUrl } from '../../../utils/history';
import { luminance } from '../../../utils/colors';
import { Location, NgClass, NgIf, NgStyle } from '@angular/common';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

export type CreditTitleBarActionImage = 'barcode-reader' | 'information' | 'report' | 'support-gray' | 'play' | 'download';

@Component({
  selector: 'app-ui-page-title-bar',
  templateUrl: './ui-page-title-bar.component.html',
  styleUrls: ['./ui-page-title-bar.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, NgxSpinnerModule],
})
export class UiPageTitleBarComponent implements OnInit, DoCheck, OnDestroy {
  @Input() closeButton: boolean;

  @Input() backButton: boolean;

  @Input() buttonLink: string;

  @Input() title: string;

  @Input() subtitle: string;

  @Input() actionText: string;

  @Input() actionImage: CreditTitleBarActionImage;

  @Input() actionSpinner = false;

  @Input() noBorderBottom = false;

  @Input() closeText = '';

  @Input() historyPop = false;

  @Input() infoButton: boolean;

  @Input() invertColor = false;

  @Input() backgroundColor: string = null;

  @Input() useCardPattern: boolean;

  patternMode: 'light' | 'dark';

  @Input()
  alignment: 'CENTER' | 'RIGHT' = 'RIGHT';

  @Input()
  rightTitle: '';

  @Input()
  internalTitle: boolean;

  externalGoBackSubscription: Subscription;
  externalHideTitleSubscription: Subscription;

  hideTitle: boolean;

  // Outputs

  @Output() emitBackButtonClick = new EventEmitter();

  @Output() emitCloseButtonClick = new EventEmitter();

  @Output() infoClick = new EventEmitter();

  @Output() emitTextClick = new EventEmitter();

  constructor(
    private router: Router,
    private location: Location,
    private externalService: ExternalService,
  ) {}

  ngOnInit() {
    if (this.useCardPattern) {
      this.setPatternMode();
      this.invertColor = true;
    }
    if (!this.internalTitle) {
      this.externalGoBackSubscription = this.externalService.goBack.subscribe(() => {
        if (this.backButton) {
          this.backButtonClick(null);
        }
        if (this.closeButton || this.closeText) {
          this.closeButtonClick(null);
        }
      });
      this.externalHideTitleSubscription = this.externalService.hideTitle.subscribe((value) => {
        this.hideTitle = value;
      });
    }
  }

  ngDoCheck(): void {
    if (!this.internalTitle) {
      this.externalService.creditTitle.next(this.title);
    }
  }

  ngOnDestroy(): void {
    if (this.externalHideTitleSubscription) {
      this.externalHideTitleSubscription.unsubscribe();
    }
    if (this.externalGoBackSubscription) {
      this.externalGoBackSubscription.unsubscribe();
    }
    if (!this.internalTitle) {
      this.externalService.creditTitle.next('');
    }
  }

  backButtonClick($event): void {
    if (this.historyPop) {
      window.history.back();
      return;
    }
    if (!this.buttonLink) {
      this.emitBackButtonClick.emit($event);
    } else {
      this.navigateToTheGivenPath();
    }
  }

  closeButtonClick($event): void {
    if (this.historyPop) {
      window.history.back();
      return;
    }
    if (!this.buttonLink) {
      this.emitCloseButtonClick.emit($event);
    } else {
      this.navigateToTheGivenPath();
    }
  }

  actionTextClick($event): void {
    if (this.actionText) {
      this.emitTextClick.emit($event);
    }
  }

  getStyles(): {
    borderBottom?: string;
    backgroundColor?: string;
  } {
    const styles: {
      borderBottom?: string;
      backgroundColor?: string;
    } = {};
    if (this.noBorderBottom) {
      styles.borderBottom = 'none';
    }
    if (this.backgroundColor) {
      styles.backgroundColor = this.backgroundColor;
    }

    return styles;
  }

  navigateToTheGivenPath(): void {
    if (shouldGoToPreviousUrl()) {
      this.location.back();
      return;
    }

    this.router.navigateByUrl(this.buttonLink);
  }

  infoItemClicked($event): void {
    this.infoClick.emit($event);
  }

  setPatternMode(): void {
    this.patternMode = luminance(this.backgroundColor) > 0.25 ? 'light' : 'dark';
  }
}
