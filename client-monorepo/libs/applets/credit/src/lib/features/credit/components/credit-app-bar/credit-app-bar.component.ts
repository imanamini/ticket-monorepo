import { Component, computed, effect, inject, input, model, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { shouldGoToPreviousUrl } from '../../data-access/utils/history';
import { CreditExternalService } from '../../data-access/services/credit-external.service';
import { Subscription } from 'rxjs';
import { NgxAppBarButtonType, NgxAppBarComponent } from '@digipay/ngx-app-bar';

export type CreditTitleBarActionImage = 'qr-scan' | 'play' | 'info-circle' | 'headphone' | 'checklist' | 'edit-square' | 'download' | '';

@Component({
  selector: 'app-credit-app-bar',
  templateUrl: './credit-app-bar.component.html',
  styleUrls: ['./credit-app-bar.component.scss'],
  standalone: true,
  imports: [NgxAppBarComponent],
})
export class CreditAppBarComponent implements OnInit, OnDestroy {
  // Inputs
  closeButton = input<boolean>();
  backButton = input<boolean>();
  buttonLink = input<string>();
  title = input<string>();
  subtitle = input<string>();
  actionText = input<string | null | boolean>();
  actionTextMode = input<'info' | 'error'>('info');
  actionImage = input<CreditTitleBarActionImage>();
  historyPop = input<boolean>(false);
  infoButton = input<boolean>();
  internalTitle = input<boolean>();
  classes = input<string>();

  // Model
  invertColor = model<boolean>(false);

  // Outputs
  onBackButtonClick = output<void>();
  onCloseButtonClick = output<void>();
  infoClick = output<void>();
  onTextClick = output<void>();

  // Component state
  hideTitle = signal<boolean | null>(null);
  private externalGoBackSubscription?: Subscription;
  private externalHideTitleSubscription?: Subscription;

  // Computed properties
  rightButton = computed(() => {
    const button: NgxAppBarButtonType = {};

    if (this.backButton()) {
      button.icon = 'arrow-right';
    }

    if (this.closeButton()) {
      button.icon = 'close';
    }

    button.size = 'medium';
    button.mode = 'icon-only';
    button.style = 'neutral-link';

    return button.icon || button.label ? button : null;
  });

  leftButton = computed(() => {
    const button: NgxAppBarButtonType = {};

    if (this.infoButton()) {
      button.icon = 'info-circle';
    } else if (this.actionImage() && this.actionImage() !== '') {
      button.icon = this.actionImage();
    }

    if (this.actionText()) {
      button.label = this.actionText()?.toString();
    } else {
      button.mode = 'icon-only';
    }

    button.size = 'medium';

    if (this.actionTextMode() === 'error') {
      button.destructive = true;
      button.style = 'link';
    } else if (this.actionTextMode() === 'info') {
      button.style = 'link';
    }

    return button.icon || button.label ? button : null;
  });

  hideTitleBar = computed(() => !this.internalTitle() && this.hideTitle() && !this.infoButton() && !this.actionText() && !this.subtitle());

  hideTitleText = computed(() => !this.internalTitle() && this.hideTitle() && (this.infoButton() || this.actionText() || this.subtitle()));

  private router = inject(Router);
  private location = inject(Location);
  private creditExternalService = inject(CreditExternalService);

  constructor() {
    effect(() => {
      if (!this.internalTitle()) {
        this.creditExternalService.creditTitle.next(this.title() || '');
      }
    });
  }

  ngOnInit(): void {
    if (!this.internalTitle()) {
      this.externalGoBackSubscription = this.creditExternalService.goBack.subscribe(() => {
        if (this.backButton()) {
          this.backButtonClick(null);
        }
        if (this.closeButton()) {
          this.closeButtonClick(null);
        }
      });

      this.externalHideTitleSubscription = this.creditExternalService.hideTitle.subscribe((value) => {
        this.hideTitle.set(value);
      });
    }
  }

  ngOnDestroy(): void {
    this.externalHideTitleSubscription?.unsubscribe();
    this.externalGoBackSubscription?.unsubscribe();

    if (!this.internalTitle()) {
      this.creditExternalService.creditTitle.next('');
    }
  }

  backButtonClick(event: any): void {
    if (this.historyPop()) {
      window.history.back();
      return;
    }

    if (!this.buttonLink()) {
      this.onBackButtonClick.emit(event);
    } else {
      this.navigateToTheGivenPath();
    }
  }

  closeButtonClick(event: any): void {
    if (this.historyPop()) {
      window.history.back();
      return;
    }

    if (!this.buttonLink()) {
      this.onCloseButtonClick.emit(event);
    } else {
      this.navigateToTheGivenPath();
    }
  }

  onLeftButtonClick(event: any): void {
    if (this.infoButton()) {
      this.infoClick.emit(event);
    }

    if (this.actionText()) {
      this.onTextClick.emit(event);
    }
  }

  onRightButtonClick(event: any): void {
    if (this.backButton()) {
      this.backButtonClick(event);
    }

    if (this.closeButton()) {
      this.closeButtonClick(event);
    }
  }

  private navigateToTheGivenPath(): void {
    if (shouldGoToPreviousUrl()) {
      this.location.back();
      return;
    }

    this.router.navigateByUrl(this.buttonLink() || '');
  }
}
