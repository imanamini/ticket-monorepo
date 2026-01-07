import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { FormModal } from '../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';

import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { finalize } from 'rxjs';
import { NobitexCreditService } from '../../../../api/clients/nobitex/nobitex-credit.service';
import { InquiryResponse } from '../../../../ui/models/nobitex/inquiry.response';
import { validateUserInShahkar } from '../../../../api/clients/nobitex/nobitex-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { estimateNobitexResponse } from '../../../../ui/models/nobitex/estimate-nobitex.response';
import { NobitexError } from '../../../../ui/models/nobitex/nobitex.error';
import { IdentityInfo } from '../../../../ui/models/nobitex/identity-info.model';
import { NobitexErrorComponent } from '../nobitex/nobitex-error/nobitex-error.component';
import { MatDialog } from '@angular/material/dialog';
import { nobitexError } from '../../../../api/clients/models/nobitex/nobitexError';
import { CustomContactFormComponent } from '../custom-contact-form/custom-contact-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
  standalone: true,
  imports: [NgIf, CustomContactFormComponent],
})
export class CustomFormComponent {
  @Input()
  title = '';

  @Input()
  image: any;

  @Input()
  subtitle = '';

  @Input()
  contactForm!: ContactForm;

  @Input()
  mainFormModal: FormModal;

  @Output() emitClose = new EventEmitter();

  constructor(
    private dialog: DialogBottomSheetService,
    private nobitexCreditService: NobitexCreditService,
    private messageservice: MessageService,
    private _dialog: MatDialog,
  ) {}

  validateUserInShahkar(userInfo) {
    const input: validateUserInShahkar = {
      nationalCode: userInfo.nationalId,
      birthDate: userInfo.birthdate,
      cellNumber: userInfo.cellNumber,
    };
    this.nobitexCreditService.isLoading.next(true);
    this.nobitexCreditService.getInquiry(input).subscribe((result: InquiryResponse) => {
      if (result.IdentityInfo) {
        this.nobitexCreditService.identityStatus.next(result.IdentityInfo);
        if (
          result.IdentityInfo.shahkarStatus &&
          result.IdentityInfo.sabteAhval.birthDateStatus &&
          !result.IdentityInfo.sabteAhval.deathStatus
        ) {
          this.nobitexCreditService
            .estimateNobitexCredit(input.cellNumber, input.nationalCode, input.birthDate)
            .pipe(
              finalize(() => {
                this.nobitexCreditService.isLoading.next(false);
              }),
            )
            .subscribe(
              (result: estimateNobitexResponse) => {
                this.nobitexCreditService.estimate.next(true);
                this.nobitexCreditService.amount.next(result.amount / 10);
                this._dialog.closeAll();
                this.nobitexCreditService.nobitexInput = {
                  nationalCode: userInfo.nationalId,
                  birthDate: userInfo.birthdate,
                  cellNumber: userInfo.cellNumber,
                };
              },
              (error) => {
                this.nobitexCreditService.estimate.next(false);
                if (error.error.info.status == 1014) {
                  const error: nobitexError = {
                    title: ` با کدملی ${userInfo.nationalId} اعتبار فعال در دیجی‌پی دارید`,
                    subtitle: 'در حال حاضر امکان ارائه سرویس اعتبار به شما را نداریم.',
                    icon: 'icon-error',
                  };

                  this.nobitexCreditService.error.next(error);
                  this.openNobitexErrorDialog();
                  return;
                }
                if (error.error.response.code === 'UserNotFound') {
                  const error: nobitexError = {
                    title: `در حال حاضر سرویس دیجی‌پی برای شما فعال نیست.`,
                    subtitle: 'بعد از مراجعه به لینک زیر و فعالسازی سرویس دیجی‌پی دوباره اقدام کنید',
                    icon: 'icon-warningg',
                    link: 'nobitex.ir',
                  };
                  this.nobitexCreditService.error.next(error);
                  this.openNobitexErrorDialog();
                  return;
                }
                if (error.error.info.message === NobitexError.Something_Went_Wrong.enMessage) {
                  this.messageservice.showErrorMessage(NobitexError.Something_Went_Wrong.faMessage);
                  return;
                }
                switch (error.error.info.status) {
                  case NobitexError['1007'].code:
                    this.messageservice.showErrorMessage(NobitexError['1007'].faMessage);
                    break;
                  case NobitexError['1008'].code:
                    this.messageservice.showErrorMessage(NobitexError['1008'].faMessage);
                    break;
                  case NobitexError['1009'].code:
                    this.messageservice.showErrorMessage(NobitexError['1009'].faMessage);
                    break;
                }
              },
            );
        }
      } else {
        this.nobitexCreditService.identityStatus.next(<IdentityInfo>{});
        this.nobitexCreditService.isLoading.next(false);

        if (result.info?.status) {
          switch (result.info?.status) {
            case NobitexError['1007'].code:
              this.messageservice.showErrorMessage(NobitexError['1007'].faMessage);
              break;
            case NobitexError['1008'].code:
              const nobitexError: nobitexError = {
                title: `شما قبلا این فرایند را انجام داده اید`,
                subtitle: '',
                icon: 'icon-not-respond',
              };

              this.nobitexCreditService.error.next(nobitexError);
              this.openNobitexErrorDialog();
              this.nobitexCreditService.showSpinner.next(false);
              this.nobitexCreditService.estimate.next(false);
              break;
          }
        } else {
          const nobitexError: nobitexError = {
            title: `سرویس دهنده در دسترسی نیست`,
            subtitle: 'لطفا دوباره تلاش کنید',
            icon: 'icon-not-respond',
          };

          this.nobitexCreditService.error.next(nobitexError);
          this.openNobitexErrorDialog();

          this.nobitexCreditService.showSpinner.next(false);
          this.nobitexCreditService.estimate.next(false);
        }

        if (result.info?.message === NobitexError.Something_Went_Wrong.enMessage) {
          this.messageservice.showErrorMessage(NobitexError.Something_Went_Wrong.faMessage);
        }
      }
    });
  }

  openNobitexErrorDialog() {
    this._dialog.closeAll();
    this.dialog.open(NobitexErrorComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      fullHeightBottomSheet: true,
      image: this.image,
    });
  }
}
