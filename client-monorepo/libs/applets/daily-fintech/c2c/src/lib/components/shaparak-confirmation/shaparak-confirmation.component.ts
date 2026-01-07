import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { CommonModule } from '@angular/common';

import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ShaparakCardInfo, ShaparakConfig } from '../../data-access/models/shaparak.model';
import { ShaparakService } from '../../data-access/services/shaparak.service';
import player from 'lottie-web/build/player/lottie_light';
import { PreviewComponent } from '@client-monorepo/daily-fintech/bank-card';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';

@Component({
  selector: 'c2c-applet-shaparak-confirmation',
  standalone: true,
  imports: [CommonModule, ApiImageModule, LottieComponent, PreviewComponent, NgxButtonComponent],
  templateUrl: './shaparak-confirmation.component.html',
  styleUrls: ['./shaparak-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class ShaparakConfirmationComponent implements OnInit, OnDestroy {
  // Injects
  private shaparakService = inject(ShaparakService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private hybridService = inject(NgxHybridService);
  private destroyRef = inject(DestroyRef);
  private actionHandlerService = inject(ActionHandlerService);

  cardInfo = computed<ShaparakCardInfo>(() => this.bottomSheetService?.data().cardInfo);
  shaparakConfig = computed<ShaparakConfig | null>(() => this.shaparakService.shaparakConfig());
  registerSpinner = signal(false);

  animationPath = '/assets/c2c/pardakhtsazi.json';

  ngOnInit() {
    this.shaparakService.setShaparakConfig(this.bottomSheetService.data().cardInfo);
  }

  cancel() {
    this.bottomSheetService.outputData.set({
      ignoreShaparak: true,
    });
    this.bottomSheetService.closeBottomSheet();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }

  continue() {
    if (this.registerSpinner()) {
      return;
    }
    this.registerSpinner.set(true);
    this.shaparakService
      .setShaparakUrl({ cardInfo: this.cardInfo(), url: '' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.registerSpinner.set(false);
          if (this.shaparakConfig()?.redirectUrl) {
            if (this.hybridService.isHybrid()) {
              window.open(this.shaparakConfig()!.redirectUrl, '_blank');
              return;
            }
            this.actionHandlerService.handle({
              type: ActionType.REDIRECT,
              payload: {
                url: this.shaparakConfig()!.redirectUrl,
                type: RedirectionTypeEnum.self,
                replaceUrl: true,
              },
            });
          }
        },
        error: () => {
          this.registerSpinner.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.shaparakService.resetShaparkConfig();
  }
}
