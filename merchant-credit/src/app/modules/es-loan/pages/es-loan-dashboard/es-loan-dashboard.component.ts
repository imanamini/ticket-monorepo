import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { SnackbarConfig } from '@digipay/ngx-snackbar/lib/data-access/models/snackbar-config';
import { ActivatedRoute, Router } from '@angular/router';
import { EsLoanDashboardApiService } from '../../../../api/clients/es-loan-dashboard/es-loan-dashboard-api.service';
import { Merchant } from '../../../../api/clients/es-loan-dashboard/es-loan-profile.model';
import { MessageService } from '../../../../core/message.service';
import { SearchRestriction } from '../../../../api/clients/shared/basic-models/search-restriction';
import { SettlementItem } from '../../../../api/clients/early-settlement/basic-models/settlement-item';
import { SettlementValue } from '../../../../api/clients/es-loan-dashboard/es-loan-search-value';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'es-loan-dashboard',
  templateUrl: './es-loan-dashboard.component.html',
  styleUrl: './es-loan-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanDashboardComponent implements OnInit {

  profile = signal<Merchant>({} as Merchant);
  settlementList = signal<SettlementItem[]>([]);
  esSettlementList = signal<SettlementItem[]>([]);
  creditId = signal<string>('');
  page = signal<number>(0);
  perPage = signal<number>(5);

  snackService = inject(SnackbarService);
  api = inject(EsLoanDashboardApiService);
  messageService = inject(MessageService);
  storage = inject(StorageService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.geProfileData();
    this.getSettlementList();
    this.getEsSettlementList();
  }

  openSnackBar(config: Partial<SnackbarConfig>): void {
    const snack = this.snackService.openSnackBar(config);

    const actionSubscriber = snack.onAction.subscribe(() => {
      actionSubscriber.unsubscribe();
    });
    const closeSubscriber = snack.onClose.subscribe((res) => {
      closeSubscriber.unsubscribe();
      actionSubscriber.unsubscribe();
    });
  }

  goToRegistration() {
    if (this.settlementList().length > 0) {
      this.openActionSnackBar();
    } else {
      this.router.navigate(['/es-loan-registration/overview'], {
        replaceUrl: true
      });
    }
  }

  openActionSnackBar(): void {
    const config: Partial<SnackbarConfig> = {
      duration: 1000000,
      message: 'درخواست تسویه زودهنگام فعال دارید.',
      description: 'بعد از تسویه در تاریخ سررسید، دریافت تسهیلات فعال می شود.',
      status: 'error',
      leftAction: {
        buttonText: 'تلاش مجدد',
        showButton: false,
        closeButton: true
      },
    };
    this.openSnackBar(config);
  }

  geProfileData() {
    this.api.getProfile().subscribe(res => {
      this.profile.set(res.merchant);
      this.creditId.set(this.profile().creditId);
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
  }

  getSettlementList() {
    this.api.getSettlementList(this.page(), this.perPage(), this.getSettlementRestrictions(), []).subscribe(response => {
      this.settlementList.set(response.settlements);
    });
  }

  getEsSettlementList() {
    this.api.getSettlementList(this.page(), this.perPage(), this.getEsSettlementRestrictions(), []).subscribe(response => {
      this.esSettlementList.set(response.settlements);
    });
  }

  private getSettlementRestrictions(): SearchRestriction[] {
    const registrations: SearchRestriction[] = [{
      'type': 'simple',
      'field': 'isInEsLoanJourney',
      'value': true,
      'operation': 'ne'
    },
      {
        'type': 'simple',
        'field': 'fundProvider',
        'value': 'saman',
        'operation': 'eq'
      },
      {
        field: 'statuses',
        type: 'collection',
        values: [
          SettlementValue.PAID,
          SettlementValue.UPLOAD_IN_PROGRESS,
          SettlementValue.UPLOADED,
          SettlementValue.ALLOCATED,
          SettlementValue.REPAYMENT_FAILED,
          SettlementValue.INCONSISTENT,
          SettlementValue.ALLOCATION_FAILED,
          SettlementValue.UNDER_PAID,
          SettlementValue.KYC_VERIFIED,
          SettlementValue.REPAID
        ]
      }];
    return registrations;
  }

  private getEsSettlementRestrictions(): SearchRestriction[] {
    const registrations: SearchRestriction[] = [{
      'type': 'simple',
      'field': 'isInEsLoanJourney',
      'value': true,
      'operation': 'eq'
    },
      {
        field: 'statuses',
        type: 'collection',
        values: [
          SettlementValue.ALLOCATED,
          SettlementValue.CONFIRMED,
          SettlementValue.INCONSISTENT
        ]
      }];
    return registrations;
  }

  goToRepayment() {
    if (this.esSettlementList().length <= 0) {
      return;
    } else {
      this.router.navigate([`es-loan-repayment/list`]);
    }
  }
}
