import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { BankCard } from '@client-monorepo/daily-fintech/bank-card';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { C2cGeneralBanksBottomSheetComponent } from '../../components/c2c-general-banks-bottom-sheet/c2c-general-banks-bottom-sheet.component';
import { CommonModule } from '@angular/common';
import { SourceStoredCardComponent } from '../../components/source-stored-card/source-stored-card.component';
import { ServerErrorPageComponent } from '../../components/server-error-page/server-error-page.component';
import { SOURCE_CARD_LOAD_STATUS } from '../../data-access/models/source-card-load-status';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { C2cSourceCardSkeletonComponent } from '../../components/c2c-source-card-skeleton/c2c-source-card-skeleton.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeneralErrorService } from '@client-monorepo/common/network';

@Component({
  selector: 'c2c-applet-c2c-source-card-step',
  standalone: true,
  imports: [PageLayoutComponent, CommonModule, SourceStoredCardComponent, ServerErrorPageComponent, C2cSourceCardSkeletonComponent],
  templateUrl: './c2c-source-card-step.component.html',
  styleUrls: ['./c2c-source-card-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cSourceCardStepComponent implements OnInit {
  // Injects
  private c2cStateService = inject(C2cStateService);
  private c2cMainService = inject(C2cMainService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private destroyRef = inject(DestroyRef);
  private generalErrorService = inject(GeneralErrorService);
  // Computed signals
  cards = computed<BankCard[]>(() => this.c2cStateService.sourceStoredCards());
  cardLoadingState = computed(() => {
    return this.c2cStateService.sourceCardsLoadStatus();
  });
  showBankButton = computed(() => this.cardLoadingState() === SOURCE_CARD_LOAD_STATUS.SUCCESS);
  goBack() {
    this.c2cMainService.goToPrevStep();
  }
  ngOnInit() {
    this.generalErrorService.closeAction.set('none');
  }

  showBanks() {
    this.bottomSheetService.openBottomSheet(C2cGeneralBanksBottomSheetComponent, {}, { noPadding: true, height: '90%' });
  }

  retry() {
    this.c2cMainService.loadC2cEssentialApis().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected readonly SOURCE_CARD_LOAD_STATUS = SOURCE_CARD_LOAD_STATUS;
}
