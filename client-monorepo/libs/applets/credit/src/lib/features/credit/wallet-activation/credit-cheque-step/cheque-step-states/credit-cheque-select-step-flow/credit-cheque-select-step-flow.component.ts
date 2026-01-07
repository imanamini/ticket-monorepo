import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { StepFlow } from '../../../../data-access/models/credit/activation/get-activation-step-detail.response';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { CreditVideoPlayerDialogComponent } from '../../../../components/credit-video-player-dialog/credit-video-player-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditNavigationCardV2Component } from '../../../../components/credit-navigation-card-v2/credit-navigation-card-v2.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'app-credit-cheque-select-step-flow',
  templateUrl: './credit-cheque-select-step-flow.component.html',
  styleUrls: ['./credit-cheque-select-step-flow.component.scss'],
  imports: [CreditPageLoadingComponent, CreditAppBarComponent, CreditNavigationCardV2Component, CreditScrollableViewComponent, NgxAlert],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeSelectStepFlowComponent implements OnInit {
  fundProviderCode = input.required<number>();
  creditId = input.required<string>();
  stepCode = input<number>();

  nextStep = output<boolean>();
  prevStep = output();

  stepFlows = signal<StepFlow[]>([]);
  headerDescription = signal<string | null>(null);
  alertMessage = signal<string | null>(null);
  gettingData = signal<boolean | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  creditChequeStepService = inject(CreditChequeStepService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.getData();
  }

  getData() {
    if (this.gettingData()) {
      return;
    }
    this.gettingData.set(true);
    this.creditApiService.getActivationStepDetail(this.fundProviderCode(), this.creditId(), this.stepCode()!).subscribe({
      next: (response) => {
        this.headerDescription.set(response.description);
        this.alertMessage.set(response.message);
        this.stepFlows.set(response.stepFlow);
        if (response.stepFlow.length === 1) {
          this.selectStepFlow(response.stepFlow[0], true);
        }
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.gettingData.set(false);
        this.prevStep.emit();
      },
    });
  }

  selectStepFlow(stepFlow: StepFlow, skipStep = false) {
    this.creditChequeStepService.selectStepFlow(stepFlow);
    this.nextStep.emit(skipStep);
  }

  goBack() {
    this.prevStep.emit();
  }

  openGuideVideoDialog() {
    this.bottomSheetService.openBottomSheet(CreditVideoPlayerDialogComponent, {
      videoUrl: 'https://www.mydigipay.com/api/website/proxy/get-file/public/2023/01/5b5a3af5-8b96-49b9-83de-4bad44290aaa.mp4',
    });
  }
}
