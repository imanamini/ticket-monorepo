import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CardInfoFormComponent } from '../../../components/card-info-form/card-info-form.component';
import { DigiCardActivateService } from '../../../data-access/services/digi-card-activate.service';
import { OtpVerificationComponent } from '../../../components/otp-verification/otp-verification.component';
import { DigiCardActivationForm } from '../../../data-access/models/digi-card-activation.interface';
import { ProfileInterface, UserDataService } from '@client-monorepo/common/user';
import { MessageService, DeviceInfoService, StorageService } from '@client-monorepo/common/utilities';
import { catchError, finalize, from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { VerificationService } from '../../../data-access/services/verification.service';
import { DigiCardSharedService } from '../../../data-access/services/digi-card-shared.service';
import { OtpSheetResult } from '../../../data-access/models/otp-component.interface';
@Component({
  selector: 'digipay-card-applet-card-activation',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, CardInfoFormComponent],
  providers: [DigiCardActivateService, VerificationService, DigiCardSharedService],
  templateUrl: './card-activation.component.html',
  styleUrl: './card-activation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardActivationComponent implements OnInit {
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  readonly digiCardActivateService = inject(DigiCardActivateService);
  readonly verificationService = inject(VerificationService);
  readonly digiCardSharedService = inject(DigiCardSharedService);
  userDataService = inject(UserDataService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  loading = signal<boolean>(false);
  userData = signal<ProfileInterface | null>(null);
  deviceInfoService = inject(DeviceInfoService);
  storageService = inject(StorageService);
  router = inject(Router);

  ngOnInit(): void {
    this.initializeUserDetail();
  }

  private initializeUserDetail() {
    this.userDataService.getUserDetail().then((userData) => {
      if (userData) {
        this.userData.set(userData);
      }
    });
  }

  submit(entity: DigiCardActivationForm) {
    this.loading.set(true);

    this.requestOtpAndGetResult$()
      .pipe(
        switchMap((result) => this.onHandlingBottomSheetActions(result)),
        switchMap((validCode) => (validCode ? this.onFetchPublicKey(validCode) : of(null))),
        switchMap((publicKey) => (publicKey ? this.onActivateCard(publicKey, entity) : of(null))),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          sessionStorage.removeItem('otp_timestamp');
          this.messageService.showSuccessMessage('دیجی‌کارت شما با موفقیت فعال شد.');
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          this.messageService.showErrorMessage(err?.error?.result?.message ?? 'خطا رخ داد.');
        },
      });
  }

  private requestOtpAndGetResult$(): Observable<OtpSheetResult> {
    return from(this.deviceInfoService.getDeviceInfo()).pipe(
      switchMap((deviceInfo) =>
        this.verificationService.sendOtpForVerification(deviceInfo).pipe(
          catchError(() => {
            return of(null);
          }),
        ),
      ),
      switchMap(() => this.openOtpBottomSheet$()),
      switchMap((result) => {
        if (!result) return of({ type: 'cancel' } as const);

        if (result.type === 'resend') {
          // resend -> do the whole flow again (get device + send otp + keep sheet open logic)
          return this.requestOtpAndGetResult$();
        }

        return of(result);
      }),
    );
  }

  private openOtpBottomSheet$() {
    this.bottomSheetService.openBottomSheet(
      OtpVerificationComponent,
      {
        title: 'احراز هویت',
        phoneNumber: this.userData()?.cellNumber,
      },
      { disableClose: true },
    );

    return this.bottomSheetService.onClose.pipe(
      take(1),
      map(() => (this.bottomSheetService.outputData() as OtpSheetResult) || null),
    );
  }

  getPublicKey() {
    return this.digiCardSharedService.getPublicKey('digicard').pipe(
      tap((res) => {
        this.digiCardSharedService.publicKey.set(res);
      }),
    );
  }

  onHandlingBottomSheetActions(result: OtpSheetResult): Observable<boolean | null> {
    if (result.type === 'cancel') return of(null);

    if (result.type !== 'submit' || !result.code) return of(null);

    return this.verificationService.verifyOtpForFeature(result.code, [850]).pipe(
      tap((res) => this.storageService.updateAuth(res)),
      map((res) => res.result.status === 0),
    );
  }

  onFetchPublicKey(validCode: boolean | null): Observable<string | null> {
    if (!validCode) {
      return of(null);
    }

    return this.getPublicKey().pipe(
      catchError(() => {
        this.messageService.showErrorMessage('خطا در دریافت کلید امنیتی. امکان فعال‌سازی کارت وجود ندارد.');
        return of(null);
      }),
    );
  }

  onActivateCard(publicKey: string | null, entity: DigiCardActivationForm): Observable<any> {
    if (!publicKey) return of(null);

    return from(
      Promise.all([
        this.digiCardSharedService.encryptData(entity.cvv2),
        this.digiCardSharedService.encryptData(entity.newPassword),
        this.digiCardSharedService.encryptData(entity.confirmedNewPassword),
      ]),
    ).pipe(
      switchMap(([cvv2, newPassword, confirmedNewPassword]) => {
        const cardId = +this.route.snapshot.paramMap.get('id')!;
        return this.digiCardActivateService.activateCard({
          cvv2,
          newPassword,
          confirmedNewPassword,
          uniqueId: cardId,
        });
      }),
      catchError((err) => {
        if (err && err.error) {
          this.messageService.showErrorIfExists(err);
        } else {
          this.messageService.showErrorMessage('خطا در رمزنگاری اطلاعات. لطفاً دوباره تلاش کنید.');
        }
        return of(null);
      }),
    );
  }
}
