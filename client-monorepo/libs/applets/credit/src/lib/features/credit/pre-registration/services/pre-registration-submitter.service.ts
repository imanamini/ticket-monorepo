import { inject, Injectable } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { VOLUNTEER_STATES } from '../../data-access/models/credit/volunteer/volunteer-state.enum';
import { PreRegisterErrorResponse } from '../../data-access/models/credit/volunteer/pre-register.response';
import { CreditNeoWarningDialogComponent } from '../../components/credit-neo-warning-dialog/credit-neo-warning-dialog.component';
import { PreRegisterRequest } from '../../data-access/models/credit/volunteer/pre-register.request';
import { Router } from '@angular/router';
import { WalletCardService } from '../../data-access/services/wallet-card.service';
import { CreditTacService } from '../../wallet-activation/credit-tac.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { MessageService } from '../../data-access/services/message.service';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Injectable({
  providedIn: 'root',
})
export class PreRegistrationSubmitterService {
  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  walletCardService = inject(WalletCardService);
  creditTacService = inject(CreditTacService);
  creditUrlService = inject(CreditUrlService);
  router = inject(Router);
  messageService = inject(MessageService);
  creditNavigationService = inject(CreditNavigationService);

  submit(payload: PreRegisterRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.creditApiService.registerVolunteer(payload).subscribe({
        next: (response) => {
          this.walletCardService.clearCache();
          switch (response.state) {
            case VOLUNTEER_STATES.REGISTERED:
              this.creditTacService.getData().subscribe((tacResponse) => {
                resolve();
                if (tacResponse.shouldAccept) {
                  this.router
                    .navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/tac'), {
                      state: {
                        destination: this.creditUrlService.getInnerServicePath(
                          `/wallet/activation/steps/${response.fundProviderCode}/${response.creditId}`,
                        ),
                      },
                    })
                    .then();
                } else {
                  this.router
                    .navigateByUrl(
                      this.creditUrlService.getInnerServicePath(
                        `/wallet/activation/steps/${response.fundProviderCode}/${response.creditId}`,
                      ),
                    )
                    .then();
                }
              });
              break;
            case VOLUNTEER_STATES.REGISTRATION_FAILED:
              this.router
                .navigateByUrl(this.creditUrlService.getInnerServicePath('/volunteer/view'), {
                  state: {
                    showVolunteer: true,
                    volunteerStateType: response.volunteerStateType,
                  },
                })
                .then();
              break;
            case VOLUNTEER_STATES.PREREGISTERED:
              this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/volunteer/view'), {
                replaceUrl: true,
                state: {
                  showVolunteer: true,
                  volunteerStateType: response.volunteerStateType,
                },
              });
              break;
            case VOLUNTEER_STATES.DUPLICATE_CELL_NUMBER:
              this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/select-plan/failed')).then();
              break;
            case VOLUNTEER_STATES.DUPLICATE_NATIONAL_ID:
              this.router
                .navigateByUrl(this.creditUrlService.getInnerServicePath('/select-plan/failed') + `?cellNumber=${response.cellNumber}`)
                .then();
              break;
            default:
              this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve')).then();
          }
        },
        error: (e: PreRegisterErrorResponse | any) => {
          if (e?.messages && e.messages?.length > 0) {
            const errors: any = {};
            e.messages.forEach((m: any) => {
              errors[m.fieldName] = m.text;
            });
            reject(errors);
          }

          if (e?.result?.status === 5237 && e.dialogDto && e.dialogDto.title && e.dialogDto.description) {
            this.bottomSheetService.openBottomSheet(
              CreditNeoWarningDialogComponent,
              {
                title: e.dialogDto.title,
                secondDesc: e.dialogDto.description,
                pictorial: true,
                buttonText: 'متوجه شدم',
              },
              { height: '90%' },
            );
            return;
          }

          if (this.messageService.hasMessage(e)) {
            this.messageService.showErrorOfErrorResponse(e);
          } else {
            this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
          }
        },
      });
    });
  }
}
