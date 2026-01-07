import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize, Subscription } from 'rxjs';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TacResponse } from '../../../../api/models/tac.response';
import { ApiResult } from '../../../../api/models/api-result';
import { CardConfigInterface } from '../card/card-config.interface';
import { TERMS_AND_CONDITIONS_CARD_CONFIG } from './consts/tac-card-config';
import { removeBaseUrl } from './remove-base-url';
import { PageManagementService } from '../../services/page-management.service';
import { PageEnum } from '../../enums/page.enum';
import { HandleErrorService } from '../../services/handle-error.service';
import {NewUpgService} from "../../../../api/services/new-upg/new-upg.service";
import * as Sentry from "@sentry/angular-ivy";
import {SavePhoneNumber} from "../../../../utils/storage";

@Component({
  selector: 'app-tac',
  templateUrl: './tac.component.html',
  styleUrls: ['./tac.component.scss']
})
export class TacComponent implements OnInit , OnDestroy {
  public termsAndConditionHtmlText: SafeHtml = null;
  public cardConfig: Partial<CardConfigInterface> = TERMS_AND_CONDITIONS_CARD_CONFIG;
  public loadingSubmit: boolean = false;
  private subscription: Subscription = new Subscription();
  private ticket: string;

  private newUpgService = inject(NewUpgService);
  private sanitizer = inject(DomSanitizer);
  private activatedRoute = inject(ActivatedRoute);
  private pageManagementService = inject(PageManagementService);
  private handleErrorService = inject(HandleErrorService);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }
  ngOnInit() {
    this.ticket = this.activatedRoute.snapshot.params['ticket'];
    this.checkTacState();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private checkTacState(): void {
    this.newUpgService.tac(this.ticket)
      .subscribe(
        (response: TacResponse) => {
          if (response.shouldAcceptTac === true) {
            this.getTacHtml(response.tacUrl);
          } else {
            this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
          }
          SavePhoneNumber(response.userDetail.cellNumber);
        }
      );
  }

  private getTacHtml(url: string): void {
    const updatedUrl = removeBaseUrl(url);
    this.subscription = this.newUpgService.getHtml(updatedUrl, {ticket: this.ticket})
      .subscribe((response) => {
        this.termsAndConditionHtmlText = this.sanitizer.bypassSecurityTrustHtml(
          response.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`)
        );
      });
  }

  public accept(): void {
    this.loadingSubmit = true;
    this.newUpgService.tacAccept(this.ticket)
      .pipe(finalize(() => this.loadingSubmit = false))
      .subscribe(() => {
        this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
      }, (error: ApiResult) => {
        this.handleErrorService.check(error);
      });
  }

}
