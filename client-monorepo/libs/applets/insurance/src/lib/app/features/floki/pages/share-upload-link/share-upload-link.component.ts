import { AfterViewInit, Component, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareUploadLinkService } from '../../services/share-upload-link.service';
import { FlokiHeaderComponent } from '../../ui-component/floki-header/floki-header.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { UploadLinkResponseModel } from '../../models/upload-link-response.model';
import { QRCodeComponent } from 'angularx-qrcode';
import { UploadLinkEnum } from '../../enums/upload-link.enum';
import { ApplicationFormService } from '../../services/application-form.service';
import { interval, Observable, Subscription } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { SendSmsLinkComponent } from './send-sms-link/send-sms-link.component';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { map, take } from 'rxjs/operators';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { IconEnum } from '../../../../data-access/enums/icon.enum';

@Component({
  selector: 'app-share-upload-link',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlokiHeaderComponent,
    QRCodeComponent,
    NgxButtonComponent,
    NgxCountDownComponent,
    NgxIcon,
    NgxSpinnerModule,
    NgxWaitingStepperComponent,
  ],
  templateUrl: './share-upload-link.component.html',
  styleUrl: './share-upload-link.component.scss',
})
export class ShareUploadLinkComponent extends BaseComponent implements OnInit, AfterViewInit {
  private readonly applicationFormService = inject(ApplicationFormService);
  private readonly shareUploadLinkService = inject(ShareUploadLinkService);
  private readonly matBottomSheet = inject(BottomSheetService);

  protected onboardingTemp = viewChild.required<TemplateRef<any>>('onboarding_temp');
  protected qrCodeTemp = viewChild.required<TemplateRef<any>>('qrCode_temp');
  protected waitingToStartTemp = viewChild.required<TemplateRef<any>>('waiting_to_start_temp');
  protected inProgressTemp = viewChild.required<TemplateRef<any>>('in_progress_temp');

  protected stepTemplate = signal<TemplateRef<any> | null>(null);
  protected isLoading = signal(false);
  protected hasError = signal(false);
  protected uploadLink = signal<UploadLinkResponseModel | null>(null);
  protected waitingStepperState = signal<WaitingStepperStateEnum>(WaitingStepperStateEnum.PROGRESS);
  protected countdown = signal<number>(0);
  protected stepperCountdown = signal<number>(0);
  protected phoneNumber = signal<string | null>(null);

  private pollingSubscription?: Subscription;
  private getUploadLinkSubscription?: Subscription;
  private countDownSubscription?: Subscription;
  private countdown$: Observable<number>;
  private uploadLinkType: UploadLinkEnum = UploadLinkEnum.Create;
  private expiresAtUtc = '';
  private formId: string | null = null;
  private retryCount = 0;
  private readonly MAX_RETRIES: number = 5;
  protected readonly IconEnum = IconEnum;
  protected readonly UploadLinkEnum = UploadLinkEnum;

  protected get isExpireQr(): boolean {
    const countdown = this.getCountdownInSeconds();
    return countdown === 0;
  }

  public ngOnInit(): void {
    this.readQueryParam();
  }

  public ngAfterViewInit(): void {
    this.stepTemplate.set(this.onboardingTemp());
  }

  private readQueryParam(): void {
    this.formId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
  }

  protected startProcessing(type: UploadLinkEnum = UploadLinkEnum.Create): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    if (this.uploadLinkType === UploadLinkEnum.Create) {
      this.stepTemplate.set(this.qrCodeTemp());
    }

    this.unSubscribeAll();
    this.generateUploadLink(type);
  }

  private getCountdownInSeconds(): number {
    if (!this.expiresAtUtc) {
      return 0;
    }

    const now = new Date();
    const expireTime = new Date(this.expiresAtUtc);
    const diffMs = expireTime.getTime() - now.getTime();
    const diffInSeconds = Math.ceil(diffMs / 1000);
    const value = Math.max(0, diffInSeconds);
    this.stepperCountdown.set(value);
    return value;
  }

  private generateUploadLink(type: UploadLinkEnum): void {
    this.getUploadLinkSubscription = this.shareUploadLinkService.getUploadLink(this.formId, type).subscribe({
      next: (res) => {
        this.expiresAtUtc = res.result.expiresAtUtc;
        if (this.isExpireQr) {
          if (this.retryCount >= this.MAX_RETRIES) {
            this.hasError.set(true);
            return;
          }
          this.retryCount++;
          this.startProcessing(UploadLinkEnum.Create);
          return;
        }
        this.countdown$ = this.startCountdownForQrcode(this.getCountdownInSeconds());
        this.countDownSubscription = this.countdown$.subscribe({
          next: (val) => {
            this.countdown.set(val);
          },
          complete: () => {
            if (this.uploadLinkType === UploadLinkEnum.Finished) {
              this.unSubscribeAll();
              return;
            }
            this.startProcessing(this.uploadLinkType);
          },
          error: (err) => {},
        });
        if (this.uploadLinkType === UploadLinkEnum.Create) {
          this.uploadLink.set(res.result);
        }
        if (this.uploadLinkType === UploadLinkEnum.Viewed) {
        }
        this.retryCount = 0;
        this.isLoading.set(false);
        this.startPolling();
      },
      error: (err) => {
        if (err.status === 422 && err.error.error.code === 2012) {
          this.getApplicationFormId();
          return;
        }
        this.hasError.set(true);
      },
    });
  }

  private getApplicationFormId(): void {
    this.applicationFormService.getDraftsWithInterceptor(this.formId).subscribe({
      next: (res) => {},
    });
  }

  private startCountdownForQrcode(seconds: number): Observable<number> {
    return interval(1000).pipe(
      map((i) => seconds - i),
      take(seconds + 1),
    );
  }

  private startPolling(): void {
    this.pollingSubscription = interval(10000).subscribe(() => {
      this.getUploadStatus();
    });
    this.getUploadStatus();
  }

  private getUploadStatus(): void {
    if (this.isExpireQr) {
      return;
    }
    const subscription = this.shareUploadLinkService.getUploadStatus(this.formId).subscribe({
      next: (res) => {
        this.uploadLinkType = res.result;
        switch (this.uploadLinkType) {
          case UploadLinkEnum.Create:
            if (this.isExpireQr) {
              this.generateUploadLink(UploadLinkEnum.Create);
            }
            break;
          case UploadLinkEnum.Viewed:
            this.stepTemplate.set(this.inProgressTemp());
            this.waitingStepperState.set(WaitingStepperStateEnum.PROGRESS);
            break;
          case UploadLinkEnum.Finished:
            this.waitingStepperState.set(WaitingStepperStateEnum.SUCCESS);
            this.unSubscribeAll();
            this.getApplicationForm();
            break;
        }
      },
      error: (err) => {},
    });
    this.addSubscription(subscription);
  }

  protected onOpenSendSmsModal(): void {
    this.matBottomSheet
      .open(
        SendSmsLinkComponent,
        {
          name: 'SendSmsLinkComponent',
        },
        {
          closeOnNavigation: true,
        },
      )
      .afterDismissed()
      .subscribe((z) => {
        if (z?.result === 'success') {
          this.stepTemplate.set(this.waitingToStartTemp());
          this.phoneNumber.set(z.phoneNumber);
        }
      });
  }

  private getApplicationForm(): void {
    const subscription = this.applicationFormService.getDraftsWithInterceptor(this.formId).subscribe({
      next: (res) => {
        this.waitingStepperState.set(WaitingStepperStateEnum.SUCCESS);
      },
      error: (err) => {
        this.waitingStepperState.set(WaitingStepperStateEnum.FAILED);
      },
    });
    this.addSubscription(subscription);
  }

  protected goBack(): void {
    this.location.back();
  }

  private unSubscribeAll(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.getUploadLinkSubscription) {
      this.getUploadLinkSubscription.unsubscribe();
    }
    if (this.countDownSubscription) {
      this.countDownSubscription.unsubscribe();
    }
    if (this.countdown$) {
      this.countdown$ = null;
    }
  }

  ngOnDestroy(): void {
    this.unSubscribeAll();
    super.ngOnDestroy();
  }
}
