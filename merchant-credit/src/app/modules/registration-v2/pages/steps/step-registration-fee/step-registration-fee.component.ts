import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../registration.service';
import { of, Subscription } from 'rxjs';
import { MessageService } from '../../../../../core/message.service';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'step-registration-fee',
  templateUrl: './step-registration-fee.component.html',
  styleUrls: ['./step-registration-fee.component.scss']
})
export class StepRegistrationFeeComponent implements OnInit {

  costItems: { title: string, subtitle: string, amount: number }[] = [];

  subscriptions: Subscription[] = [];

  loading = true;

  totalAmount = 0;

  pendingAction = false;

  cardDescription = '';

  constructor(
    private service: RegistrationService,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions[0] = this.service.getTicketDetail().subscribe(details => {
      if (details) {
        this.service.getPaymentDetails().pipe(
          switchMap(response => {
            this.costItems = response.details.map(item => ({
              amount: item.amount,
              subtitle: '',
              title: item.title
            }));
            this.totalAmount = response.totalAmount;
            this.cardDescription = response.description;
            this.loading = false;
            this.changeDetectorRef.detectChanges();
            return [];
          })
        ).subscribe();
      }
    });
  }

  initializePayment(): void {
    this.pendingAction = true;
    this.service.initializeFeePayment().pipe(
      switchMap(res => {
        if (res.trackingCode) {
          this.pendingAction = false;
          this.service.redirectToGateway(res.trackingCode);
        }
        return of(null);
      }),
      catchError(err => {
        this.pendingAction = false;
        this.messageService.showErrorIfExists(err);
        return of(null);
      })
    ).subscribe();
  }

  onBackClick(): void {
    this.service.goToOverviewPage();
  }

}
