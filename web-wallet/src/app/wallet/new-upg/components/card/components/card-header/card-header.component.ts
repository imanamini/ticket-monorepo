import {Component, EventEmitter, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {DialogService} from '../../../../services/dialog.service';
import {ActivatedRoute} from '@angular/router';
import {PageManagementService} from '../../../../services/page-management.service';
import {PageEnum} from '../../../../enums/page.enum';
import {GetCallbackUrl, GetTTL, SaveTTL} from '../../../../../../utils/storage';
import {TicketInfoService} from '../../../../services/ticket-info.service';
import {NavigateToExternalUrl} from '../../../../../../utils/navigation';
import {AutoSubmitService} from '../../../../services/auto-submit.service';
import * as Sentry from "@sentry/angular-ivy";

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class CardHeaderComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  closeButton: 'NONE' | 'BACK' | 'EXIT' = 'EXIT';
  @Input()
  customizeBackAction: boolean;
  @Output()
  onBackClicked: EventEmitter<void> = new EventEmitter<void>();

  public ttl: number;
  public dialogService = inject(DialogService);
  public ticketInfoService = inject(TicketInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private pageManagementService = inject(PageManagementService);
  private autoSubmit = inject(AutoSubmitService);
  @HostListener('window:beforeunload')
  public onBeforeUnload(): void {
    history.pushState(null, null, window.location.href);
  }

  @HostListener('window:popstate')
  public onPopState(): void {
    this.onBackBrowserButtonClick();
  }

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  ngOnInit(): void {
    this.exceptionToHandlingBackSetting();
    this.setTTL();
  }

  public close(): void {
    if (this.customizeBackAction) {
      this.onBackClicked.emit();
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
  public finishTimer(): void {
    const callbackUrl: string = GetCallbackUrl();
    NavigateToExternalUrl(callbackUrl);
  }

  public saveRemainingTime(remainingTime: number) {
    SaveTTL(this.getTicket(), remainingTime.toString());
  }

  private getTicket(): string {
    return this.activatedRoute.snapshot.params['ticket'];
  }

  private setTTL(): void {
    const getTTLFromStorage = GetTTL(this.getTicket());
    if (getTTLFromStorage) {
      this.ttl = Number(getTTLFromStorage);
      return;
    }
    this.ttl = this.ticketInfoService.state.ttl;
  }

  private onBackBrowserButtonClick(): void {
    if (this.customizeBackAction) {
      this.onBackClicked.emit();
      return;
    }
    const exceptionToClosing: boolean = Boolean(this.autoSubmit.getState());
    const pageName: PageEnum = this.activatedRoute.snapshot.queryParams['page'];

    if (exceptionToClosing || pageName === 'PAYMENT_METHOD' || 'TERMS_AND_CONDITIONS') {
      this.dialogService.openExitAlert(this.ticketInfoService.state, pageName === 'OTP' || pageName === 'PIN' || pageName === 'CASH_IN_AND_PAY' || exceptionToClosing);
      return;
    }
    this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
  }

  private exceptionToHandlingBackSetting(): void {
    const exceptionToClosing: boolean = Boolean(this.autoSubmit.getState());
    if (exceptionToClosing) {
      this.closeButton = 'EXIT';
    }
  }
}
