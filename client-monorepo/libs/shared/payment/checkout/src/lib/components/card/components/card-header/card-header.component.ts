import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, inject, input, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Sentry from '@sentry/angular-ivy';
import { CommonModule } from '@angular/common';
import { PageManagementService } from '../../../../data-access/services/page-management.service';
import { AutoSubmitService } from '../../../../data-access/services/auto-submit.service';
import { PageType } from '../../../../data-access/models/page.type';
import { DialogService } from '../../../../data-access/services/dialog.service';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { PageEnum } from '../../../../data-access/models/page.enum';

@Component({
  selector: 'payment-checkout-card-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeaderComponent implements OnInit {
  isBottomSheet = input<boolean>(false);
  @Input()
  title = '';
  @Input()
  closeButton: 'NONE' | 'BACK' | 'EXIT' = 'EXIT';
  @Input()
  customizeBackAction = false;
  @Output()
  clickedBack: EventEmitter<void> = new EventEmitter<void>();

  public dialogService = inject(DialogService);
  public ticketInfoService = inject(TicketInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private pageManagementService = inject(PageManagementService);
  private autoSubmit = inject(AutoSubmitService);

  // todo check these
  @HostListener('window:beforeunload')
  public onBeforeUnload(): void {
    history.pushState(null, '', window.location.href);
  }

  // todo check these
  @HostListener('window:popstate')
  public onPopState(): void {
    this.onBackBrowserButtonClick();
  }

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  ngOnInit(): void {
    this.exceptionToHandlingBackSetting();
  }

  public close(): void {
    if (this.customizeBackAction) {
      this.clickedBack.emit();
      return;
    }
    switch (this.closeButton) {
      case 'BACK':
        this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
        break;
      case 'EXIT':
        this.dialogService.openExitAlert(this.ticketInfoService.state);
        break;
    }
  }

  private onBackBrowserButtonClick(): void {
    if (this.customizeBackAction) {
      this.clickedBack.emit();
      return;
    }
    const exceptionToClosing = Boolean(this.autoSubmit.getState());
    const pageName: PageType = this.activatedRoute.snapshot.queryParams['page'];

    // todo check condition
    if (exceptionToClosing || pageName === 'PAYMENT_METHOD' || pageName === 'TERMS_AND_CONDITIONS') {
      this.dialogService.openExitAlert(this.ticketInfoService.state);
      return;
    }
    this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
  }

  private exceptionToHandlingBackSetting(): void {
    const exceptionToClosing = Boolean(this.autoSubmit.getState());
    if (exceptionToClosing) {
      this.closeButton = 'EXIT';
    }
  }
}
