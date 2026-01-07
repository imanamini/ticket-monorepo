import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditPhysicalEnoteOnePaperBottomSheetComponent } from './credit-physical-enote-one-paper-bottom-sheet/credit-physical-enote-one-paper-bottom-sheet.component';
import { CreditCacheService } from '../../../../data-access/services/credit-cache.service';
import { CreditNoteCacheKeys } from '../../credit-enote-gateway/credit-note-cache-keys';
import { NoteTypeModel } from '../../../../data-access/models/credit/activation/enote-step/note-type.model';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { PhysicalNoteNotices } from '../../../../data-access/models/credit/activation/enote-step/physical-note-notices';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditNoticesComponent } from '../../../../components/credit-notices/credit-notices.component';

@Component({
  selector: 'app-credit-physical-enote-step-notices',
  templateUrl: './credit-physical-enote-step-notices.component.html',
  styleUrls: ['./credit-physical-enote-step-notices.component.scss', '../../credit-enote.scss'],
  standalone: true,
  imports: [NgxButtonComponent, CreditPageLoadingComponent, CreditAppBarComponent, CreditScrollableViewComponent, CreditNoticesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteStepNoticesComponent implements OnInit {
  switchTypePossible = input<boolean>();
  creditId = input.required<string>();

  nextStep = output<void>();
  prevStep = output<void>();
  changeNoteTypeClicked = output<void>();

  submittingData = signal<boolean | null>(null);
  amount!: number;
  notices = PhysicalNoteNotices;

  bottomSheetService = inject(NgxBottomSheetService);
  cache = inject(CreditCacheService);
  apiService = inject(CreditApiService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.amount = this.cache
      .get(CreditNoteCacheKeys.config)
      ?.pages.find((page: { type: NoteTypeModel }) => page.type === NoteTypeModel.PHYSICAL).amount;
  }

  onChangeEnoteType() {
    this.changeNoteTypeClicked.emit();
  }

  onSubmit() {
    this.bottomSheetService.openBottomSheet(CreditPhysicalEnoteOnePaperBottomSheetComponent, {
      amount: this.amount,
    });

    const bottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      const result = this.bottomSheetService.outputData();
      bottomSheet.unsubscribe();
      if (result && result.nextStep) {
        this.onboard();
      }
    });
  }

  onboard() {
    this.submittingData.set(true);
    this.apiService.onboardPhysicalNote(this.creditId()).subscribe({
      next: (_) => {
        this.submittingData.set(false);
        this.nextStep.emit();
      },
      error: (e) => {
        this.submittingData.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }
}
