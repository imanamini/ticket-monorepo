import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralErrorService } from '../../data-access/services/general-error.service';
import { ERROR_DATA_CONFIG } from '../../data-access/constants/error-data-config';
import { ErrorImageComponent } from '../error-image/error-image.component';
import { InternetConnectionService } from '../../data-access/services/internet-connection.service';
import { delay, of, Subscription } from 'rxjs';
import { GeneralErrorTypes } from '../../data-access/models/general-error-types';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AbTestService, MessageService } from '@client-monorepo/common/utilities';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'common-network-error-page',
  standalone: true,
  imports: [CommonModule, ErrorImageComponent, NgxButtonComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit, OnDestroy {
  disableButton = signal<boolean>(false);
  generalErrorService = inject(GeneralErrorService);
  messageService = inject(MessageService);
  internetConnectionService = inject(InternetConnectionService);
  private backHandlerService = inject(BackHandlerService);
  error = computed(() => {
    return this.generalErrorService.error();
  });
  isUnavailableSystemError = computed(() => {
    return this.error() === GeneralErrorTypes.UNAVAILABLE_SYSTEM_ERROR;
  });
  isAccessError = computed(() => {
    return this.error() === GeneralErrorTypes.ACCESS_ERROR;
  });

  backgroundClasses = computed(() => {
    if (this.isUnavailableSystemError() || this.isAccessError()) {
      return 'surface-glass-high-contrast-invert elevation-overlay-blur';
    }
    return 'surface-high-contrast';
  });

  titleTextClasses = computed(() => {
    if (this.isAccessError()) {
      return 'st-3 text-oninvert-high';
    }
    if (this.isUnavailableSystemError()) {
      return 'st-6 text-oninvert-high';
    }
    return 'st-6 text-onback-high';
  });

  messageTextClasses = computed(() => {
    if (this.isUnavailableSystemError() || this.isAccessError()) {
      return 'text-oninvert-medium';
    }
    return 'text-onback-medium';
  });
  config = computed(() => {
    const error = this.error();
    return error ? ERROR_DATA_CONFIG[error] : null;
  });
  errorDetails = computed(() => {
    return this.generalErrorService.detail();
  });
  showErrorDetails = signal<boolean>(false);
  onlineSubscription!: Subscription;
  offlineSubscription!: Subscription;

  ngOnInit() {
    this.checkInternetConnection();
    this.showErrorDetails.set(AbTestService.showErrorDetail());
  }

  checkInternetConnection(): void {
    this.onlineSubscription = this.internetConnectionService.getOnlineEvent().subscribe(() => {
      this.generalErrorService.error.set(null);
    });
    this.offlineSubscription = this.internetConnectionService.getOfflineEvent().subscribe(() => {
      this.generalErrorService.error.set(GeneralErrorTypes.INTERNET_ERROR);
    });
  }

  handleRetry(): void {
    this.disableButton.set(true);
    window.location.reload();
  }

  returnToHome() {
    this.disableButton.set(true);
    window.location.href = '/';
  }

  ngOnDestroy(): void {
    this.onlineSubscription?.unsubscribe();
    this.offlineSubscription?.unsubscribe();
  }

  handleDetailClick(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.errorDetails()).then(
        () => {
          of('')
            .pipe(delay(2000))
            .subscribe({
              next: () => {
                this.messageService.showSuccessMessage('کپی شد');
              },
            });
        },
        function (err) {
          console.error('Async: Could not copy text: ', err);
        },
      );
    }
  }
  goBack(): void {
    this.disableButton.set(true);
    this.generalErrorService.error.set(null);
    if (this.generalErrorService.closeAction() === 'back') {
      this.backHandlerService.goBack();
    }
  }
}
