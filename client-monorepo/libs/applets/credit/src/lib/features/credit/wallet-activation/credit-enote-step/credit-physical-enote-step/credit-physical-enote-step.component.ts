import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { CreditNoteCacheKeys } from '../credit-enote-gateway/credit-note-cache-keys';
import { CreditNoteService } from '../credit-note.service';
import { ENOTE_STEP_STATUS } from '../../../data-access/models/credit/activation/enote-step/enote-step-status';
import { CreditPhysicalNoteNoticesBottomSheetComponent } from './credit-physical-note-notices-bottom-sheet/credit-physical-note-notices-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPhysicalEnoteStepNoticesComponent } from './credit-physical-enote-step-notices/credit-physical-enote-step-notices.component';
import { CreditPhysicalEnoteStepRegisterComponent } from './credit-physical-enote-step-register/credit-physical-enote-step-register.component';
import { CreditPhysicalEnoteStepGuideComponent } from './credit-physical-enote-step-guide/credit-physical-enote-step-guide.component';
import { CreditPhysicalEnoteStepUploadComponent } from './credit-physical-enote-step-upload/credit-physical-enote-step-upload.component';
import { CreditPhysicalEnoteStepErrorComponent } from './credit-physical-enote-step-error/credit-physical-enote-step-error.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

enum PhysicalNoteStates {
  NOTICES,
  REGISTER,
  GUIDE,
  UPLOAD,
  ERROR,
}

@Component({
  selector: 'app-credit-physical-enote-step',
  templateUrl: './credit-physical-enote-step.component.html',
  styleUrls: ['./credit-physical-enote-step.component.scss'],
  standalone: true,
  imports: [
    CreditPhysicalEnoteStepNoticesComponent,
    CreditPhysicalEnoteStepRegisterComponent,
    CreditPhysicalEnoteStepGuideComponent,
    CreditPhysicalEnoteStepUploadComponent,
    CreditPhysicalEnoteStepErrorComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteStepComponent implements OnInit {
  showLoading = signal<boolean>(false);
  fundProviderCode = signal<number | null>(null);
  switchTypePossible = signal<boolean | null>(null);
  creditId = signal<string | null>(null);
  states = ['NOTICES', 'REGISTER', 'GUIDE', 'UPLOAD', 'ERROR'];
  skippedStepsList: { [key: number]: boolean } = {};
  stateIndex = signal(PhysicalNoteStates.NOTICES);
  bottomSheetService = inject(NgxBottomSheetService);
  activatedRoute = inject(ActivatedRoute);
  cache = inject(CreditCacheService);
  noteService = inject(CreditNoteService);

  ngOnInit(): void {
    this.fundProviderCode.set(+this.activatedRoute.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);

    if (
      !this.cache.has(CreditNoteCacheKeys.switchTypePossible) ||
      !this.cache.has(CreditNoteCacheKeys.config) ||
      !this.cache.has(CreditNoteCacheKeys.noteStatus)
    ) {
      this.noteService.resolve(this.fundProviderCode()!, this.creditId()!);
      return;
    }
    this.switchTypePossible.set(this.cache.get(CreditNoteCacheKeys.switchTypePossible));
    this.goSpecificStage();
  }

  prevState() {
    if (this.stateIndex() <= 0) {
      this.goBack();
      return;
    }
    this.stateIndex.update((index) => index - 1);
    if (this.skippedStepsList[this.stateIndex()]) {
      this.prevState();
    }
  }

  nextState(skippedStep = false) {
    if (skippedStep) {
      this.skippedStepsList[this.stateIndex()] = true;
    }
    if (this.stateIndex() >= this.states.length - 1) {
      // finish
      return;
    }
    this.stateIndex.update((index) => index + 1);
    if (this.skippedStepsList[this.stateIndex()]) {
      this.nextState();
    }
  }

  goBack() {
    this.noteService.closeStep(this.fundProviderCode()!, this.creditId()!);
  }

  onChangeEnoteType() {
    this.noteService.goSelectPage(this.fundProviderCode()!, this.creditId()!);
  }

  openNotices() {
    this.bottomSheetService.openBottomSheet(CreditPhysicalNoteNoticesBottomSheetComponent, {});
  }

  goToRegister() {
    this.stateIndex.set(PhysicalNoteStates.REGISTER);
  }

  goSpecificStage() {
    switch (this.cache.get(CreditNoteCacheKeys.noteStatus)) {
      case ENOTE_STEP_STATUS.INITIATED:
        this.stateIndex.set(PhysicalNoteStates.NOTICES);
        break;
      case ENOTE_STEP_STATUS.PHYSICAL_ON_BOARDED:
        this.stateIndex.set(PhysicalNoteStates.REGISTER);
        break;
      case ENOTE_STEP_STATUS.PHYSICAL_GENERATED:
        this.stateIndex.set(PhysicalNoteStates.GUIDE);
        break;
      case ENOTE_STEP_STATUS.PHYSICAL_UPLOADED:
        this.stateIndex.set(PhysicalNoteStates.UPLOAD);
        break;
      case ENOTE_STEP_STATUS.PHYSICAL_REJECTED:
        this.stateIndex.set(PhysicalNoteStates.ERROR);
        break;
      case ENOTE_STEP_STATUS.COMPLETED:
        this.noteService.closeStep(this.fundProviderCode()!, this.creditId()!);
        break;
      default:
        this.stateIndex.set(PhysicalNoteStates.NOTICES);
    }
  }
}
