import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsLoanRegistrationService } from '../../services/es-loan-registration.service';
import { StorageService } from '../../../../services/storage.service';
import { EsLoanStep } from '../../../../api/clients/es-loan-registration/models/es-loan-step';
import {
  EsloanMerchant,
  EsLoanRule,
  EsLoanStateModel
} from '../../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';
import { combineLatest } from 'rxjs';
import { TicketService } from '../../../../core/ticket.service';
import { MessageService } from '../../../../core/message.service';
import {
  EsLoanRegistrationApiService
} from '../../../../api/clients/es-loan-registration/es-loan-registration-api.service';

@Component({
  selector: 'es-loan-registration-overview',
  templateUrl: './es-loan-registration-overview.component.html',
  styleUrl: './es-loan-registration-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationOverviewComponent implements OnInit {

  steps = signal<EsLoanStep[]>([]);
  esLoanStateModel = signal<EsLoanStateModel>({} as EsLoanStateModel);
  creditId = signal<string>('');
  registrationId = signal<string>('');
  registrationMaxAmount = signal<number>(0);

  esLoanRegistrationService = inject(EsLoanRegistrationService);
  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  storage = inject(StorageService);
  ticketService = inject(TicketService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.esLoanRegistrationService.getStep();
    this.getSteps();
    this.getRegistrationId();
  }

  onStepActionClick() {
    if (this.creditId()) {
      this.router.navigate([`es-loan-registration/${this.creditId()}`], {
        replaceUrl: true
      });
    } else {
      return;
    }
  }

  goToDashboard() {
    const ticket = this.storage.getTicket();
    this.router.navigate([`es-loan/${ticket}/home`]);
  }

  getSteps() {
    combineLatest([this.esLoanRegistrationService.steps, this.esLoanRegistrationService.esLoanStateModel, this.esLoanRegistrationService.requestAmount]).subscribe(
      ([steps, esLoanStateModel, requestAmount]) => {
        if (steps.length > 0 && esLoanStateModel) {
          this.steps.set(steps);
          this.registrationMaxAmount.set(requestAmount);
          this.esLoanStateModel.set(esLoanStateModel);
        }
      }
    );
  }

  getRegistrationId(): void {
    this.esLoanRegistrationApiService.getRegistrationIdFromDetail().subscribe(res => {
      this.registrationId.set(res.registrationId);
      this.esLoanRegistrationApiService.getRules(this.registrationId()).subscribe(res => {
        const rule: EsLoanRule | undefined = res.rules.find(
          (item) => item.fundProviderId === 'saman' && item.merchantType === 0
        );
        if (rule) {
          this.esLoanRegistrationApiService.assignRule(this.registrationId(), rule?.uid).subscribe(res => {
            this.creditId.set(res.creditId);
            this.esLoanRegistrationService.creditId.next(this.creditId());
          });
        } else {
          this.esLoanRegistrationApiService.getMerchants().subscribe((res) => {
            const businessUrl = res.businessSettlementUrl;
            sessionStorage.setItem('businessUrl', businessUrl);
            const merchant: EsloanMerchant | undefined = res.merchants.find(
              (item) => item.fundProvider === 'saman'
            );
            if (merchant) {
              this.creditId.set(merchant.creditId);
              this.esLoanRegistrationService.creditId.next(this.creditId());
            }
          });
        }
      }, error => {
        console.log('Error', error);
      });
    });
  }

}
