import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ViolationJourneyMapper, ViolationPurchaseStatus, ViolationStep } from '../constants/violation.const';
import { Store, StoreType } from '@client-monorepo/stores';
import { PaymentChannelToPurchaseModeMapper, PurchaseModel } from '@client-monorepo/payment/purchase';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ViolationBottomSheetItemModel, ViolationDocumentsModel } from '../models/violation.model';
import { ViolationBottomSheetComponent } from '../../components/violation-bottom-sheet/violation-bottom-sheet.component';

@Injectable()
export class ViolationService {
  bottomSheetService = inject(NgxBottomSheetService);
  destroyRef = inject(DestroyRef);

  currentStep = signal(0);
  steps = computed<ViolationStep[]>(() => (this.purchaseStatus() ? ViolationJourneyMapper[this.purchaseStatus()!] : []));
  params = signal<{ [key: string]: string }>({});
  sectionToShow = signal<'START' | 'STEPPER' | 'END'>('START');
  purchaseStatus = signal<ViolationPurchaseStatus | undefined>(undefined);
  store = signal<Store | undefined>(undefined);
  purchase = signal<PurchaseModel | undefined>(undefined);
  reasons = signal<string[] | undefined>(undefined);
  documents = signal<ViolationDocumentsModel | undefined>(undefined);
  paymentMethod = signal<StoreType | undefined>(undefined);
  purchaseType = computed(() =>
    this.purchase()?.activityPaymentChannel ? PaymentChannelToPurchaseModeMapper[this.purchase()!.activityPaymentChannel] : undefined,
  );
  guaranteedStore = computed(() => this.store() ?? this.purchase()?.store);

  nextStep() {
    if (this.currentStep() === this.steps().length - 1) {
      this.finalize();
      return;
    }
    this.currentStep.update((step) => step + 1);
  }

  finalize(): void {
    this.sectionToShow.set('END');
  }

  showBottomSheet(items: ViolationBottomSheetItemModel[] | undefined, title: string, callback: (() => void) | undefined = undefined): void {
    this.bottomSheetService.openBottomSheet(ViolationBottomSheetComponent, { items, title }, { noPadding: true });
    const ref = this.bottomSheetService.onClose.subscribe({
      next: () => {
        ref.unsubscribe();
        const data = this.bottomSheetService.outputData() as StoreType;
        if (data !== null) {
          this.paymentMethod.set(data);
          this.nextStep();
          if (callback) {
            callback();
          }
        }
      },
    });
  }
}
