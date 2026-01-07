import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from '../preview/preview.component';
import { CardPreviewConfigInterface } from '../../data-access/models/card-preview-config.interface';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { BankCardApiService } from '../../data-access/services/bank-card-api.service';
import { Router } from '@angular/router';
import { ServiceType, ToggleCardToBnplErrorStatus } from '../../data-access/models/card-api.interface';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

export interface CardSummaryOutputDataInterface {
  card: CardPreviewConfigInterface;
  action: 'delete' | 'togglePin' | 'toggleBnpl';
}

@Component({
  selector: 'daily-bank-card-card-summary',
  standalone: true,
  imports: [CommonModule, PreviewComponent, DpIconComponent, NgxButtonComponent],
  templateUrl: './card-summary.component.html',
  styleUrl: './card-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSummaryComponent {
  cardSummary: CardPreviewConfigInterface;
  bottomSheetService = inject<NgxBottomSheetService<CardSummaryOutputDataInterface>>(NgxBottomSheetService);
  bankCardApi = inject(BankCardApiService);
  router = inject(Router);
  message = inject(MessageService);

  gettingConfirmation = signal<boolean>(false);
  availableServiceType = signal<ServiceType[]>([]);
  readonly serviceType = ServiceType;

  public get hasAvailableServicePaymentPos(): boolean {
    return !!this.availableServiceType()?.find((type: ServiceType) => type === ServiceType.POS_PAYMENT);
  }

  public get hasAttachServicePaymentPos(): boolean {
    return !!this.cardSummary?.attachedServiceType?.find((type: ServiceType) => type === ServiceType.POS_PAYMENT);
  }

  constructor() {
    this.cardSummary = this.bottomSheetService.data().card;
    this.addAliesToCard();
    this.availableServiceType.set(this.bottomSheetService.data().availableServiceType);
  }

  togglePin(): void {
    const bankName = this.cardSummary.bankName?.replace('بانک ', '');
    this.bankCardApi.togglePin(bankName as string, this.cardSummary.id as string, !this.cardSummary.isPinned).subscribe(() => {
      this.bottomSheetService.closeBottomSheet();
    });
    this.bottomSheetService.outputData.set({
      card: this.cardSummary,
      action: 'togglePin',
    });
  }

  public toggleBnplConfirmation() {
    this.gettingConfirmation.set(!this.gettingConfirmation());
  }

  deleteCard() {
    this.bankCardApi.deleteCard(this.cardSummary.id as string).subscribe({
      next: () => {
        this.bottomSheetService.outputData.set({
          card: this.cardSummary,
          action: 'delete',
        });
        this.bottomSheetService.closeBottomSheet();
      },
    });
  }

  gotoEdit(): void {
    this.router
      .navigate(['/profile', 'saved-cards', 'edit', this.cardSummary.isDestination ? 'destination' : 'source', this.cardSummary.id])
      .then(() => {
        this.bottomSheetService.closeBottomSheet();
      });
  }

  toggleBnpl() {
    if (this.hasAttachServicePaymentPos) {
      this.detachCard();
    } else {
      this.attachCard();
    }
  }

  attachCard() {
    const { postfix, prefix, id: value }: any = this.cardSummary;
    this.bankCardApi
      .attachCard({
        pan: {
          postfix,
          prefix,
          value,
          type: 2,
        },
        serviceType: ServiceType.POS_PAYMENT,
      })
      .subscribe({
        next: () => {
          this.message.showSuccessMessage('کارت بانکی با موفقیت به اعتبار دیجی‌پی شما متصل شد.');
          this.bottomSheetService.closeBottomSheet();
          this.bottomSheetService.outputData.set({
            card: this.cardSummary,
            action: 'toggleBnpl',
          });
        },
        error: (error) => {
          if (error?.error?.result?.status === ToggleCardToBnplErrorStatus.ACCOUNT_VERIFICATION_STATUS_FAILED) {
            this.openUseOwnCardNotificationError();
          } else {
            this.message.showErrorOfErrorResponse(error);
          }
        },
      });
  }

  private detachCard() {
    const { postfix, prefix, id: value }: any = this.cardSummary;
    this.bankCardApi
      .detachCard({
        pan: {
          postfix,
          prefix,
          value,
          type: 2,
        },
        serviceType: ServiceType.POS_PAYMENT,
      })
      .subscribe({
        next: (data) => {
          this.message.showSuccessMessage('کارت بانکی با موفقیت از اعتبار دیجی‌پی شما جداسازی شد.');
          this.bottomSheetService.closeBottomSheet();
          this.bottomSheetService.outputData.set({
            card: this.cardSummary,
            action: 'toggleBnpl',
          });
        },
        error: (error) => {
          this.message.showErrorOfErrorResponse(error);
        },
      });
  }
  openUseOwnCardNotificationError() {
    this.message.showErrorMessage(`
      برای اتصال کارت بانکی به اعتبار دیجی‌پی، می‌بایست از کارت بانکی که به نام
      خودتان است استفاده کنید.
    `);
  }

  private addAliesToCard() {
    if (this.hasAttachServicePaymentPos) {
      this.cardSummary.alias = 'متصل به اعتبار دیجی‌پی';
    }
  }
}
