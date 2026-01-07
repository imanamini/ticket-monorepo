import { Component, computed, DestroyRef, ElementRef, inject, model, OnInit, output, signal, viewChild } from '@angular/core';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import html2canvas from 'html2canvas';
import { convertEnglishDigitsToPersian } from '@digipay/strings';
import { CreditChequeNoticesBottomSheetComponent } from '../../credit-cheque-notices-bottom-sheet/credit-cheque-notices-bottom-sheet.component';
import { AnimationLoader, AnimationOptions, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { pinchAnimation } from './pinch-animation.const';
import player from 'lottie-web';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { CreditDeviceService } from '../../../../data-access/services/credit-device.service';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageMagnifierDirective } from '../../../../data-access/directives/image-magnifire.directive';
import { PanZoomDirective } from '../../../../data-access/directives/pan-and-zoom.directive';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';

@Component({
  selector: 'app-credit-cheque-step-guide',
  templateUrl: './credit-cheque-step-guide.component.html',
  styleUrls: ['./credit-cheque-step-guide.component.scss'],
  imports: [
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    CreditPageLoadingComponent,
    NgxStatusResultModule,
    ImageMagnifierDirective,
    LottieComponent,
    PanZoomDirective,
    CreditStepperComponent,
  ],
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
  standalone: true,
})
export class CreditChequeStepGuideComponent implements OnInit {
  hintButtons: Buttons = {
    id: 'primary',
    style: 'tinted-on-elevated',
    label: 'شروع نوشتن چک',
    mode: 'section',
  };
  chequeOrder = model<number>();
  creditId = model<string>();
  isInstallment = model(true);

  chequeGuidData = signal<any | null>(null);
  touched = signal<boolean>(false);
  gettingData = signal<boolean>(true);
  isModeBottomSheet = signal<boolean>(false);
  chequeImage = signal<string | null>(null);
  showHint = signal<boolean>(true);
  isDesktop = signal<boolean>(false);
  showLottie = signal<boolean>(true);

  options = computed<AnimationOptions>(() => {
    return {
      animationData: pinchAnimation,
    };
  });

  dueDate = computed(() => this.chequeGuidData()?.dueDate.split('/').join(''));

  nextStep = output();
  prevStep = output();
  openNotices = output();
  protected readonly BorderColorsEnum = BorderColorsEnum;

  chequeRawElement = viewChild<ElementRef>('chequeRawElement');
  private apiService = inject(CreditApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);
  private creditDeviceService = inject(CreditDeviceService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isDesktop.set(this.creditDeviceService.isDesktop());

    if (this.bottomSheetService.data()) {
      this.creditId.set(this.bottomSheetService.data().creditId);
      this.isInstallment.set(this.bottomSheetService.data().isInstallment);
      this.chequeOrder.set(this.bottomSheetService.data().chequeOrder);
    }

    this.apiService.getChequeGuid(this.creditId()!, this.isInstallment(), this.chequeOrder()!).subscribe({
      next: (response) => {
        this.chequeGuidData.set({
          amount: response.amount.replaceAll('٬', ''),
          dueDateInLetters: response.dueDateInLetters,
          amountInLetters: response.amountInLetters,
          dueDate: response.dueDate,
          receiverName: response.receiverName,
          receiverNationalId: convertEnglishDigitsToPersian(response.receiverNationalId),
          signatureHint: 'اینجا امضا کنید',
        });
        this.gettingData.set(false);
        setTimeout(() => {
          this.chequeToImage();
        }, 50);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.gettingData.set(false);
      },
    });
  }

  hideHintOverlay() {
    this.showHint.set(false);
    let timeToHideLottie = 5000;
    const timeInterval: any = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (timeToHideLottie) {
          timeToHideLottie -= 1000;
        } else {
          this.showLottie.set(false);
          clearInterval(timeInterval);
        }
      });
  }

  chequeToImage() {
    const element = this.chequeRawElement();
    if (!element?.nativeElement) {
      return;
    }
    html2canvas(element.nativeElement, { scale: 2 }).then((canvas) => {
      this.chequeImage.set(canvas.toDataURL('image/png', 5.0));
    });
  }

  onSubmit() {
    this.nextStep.emit();
    if (this.isModeBottomSheet()) {
      this.bottomSheetService.closeBottomSheet();
    }
  }

  onTextClick() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeNoticesBottomSheetComponent,
      {},
      {
        noPadding: true,
      },
    );
  }
}
