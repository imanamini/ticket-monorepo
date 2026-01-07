import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Router } from '@angular/router';
import { BuyerOrderService } from '../../../data-access/services/buyer-order.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { RateOrderRequest } from '../../../data-access/models/rate.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { EMOJIS } from '../../../data-access/constants/emoji.const';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-home-applet-buyer-rating',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxStatusResultModule, NgxButtonComponent],
  templateUrl: './buyer-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerRatingComponent implements OnInit {
  ratingForm!: FormGroup;
  fb = inject(FormBuilder);
  route = inject(Router);
  buyerOrderService = inject(BuyerOrderService);
  messageService = inject(MessageService);
  bottomSheetService = inject(NgxBottomSheetService);
  rates = signal(EMOJIS);
  selectedRate = signal<{ img: string; score: number; title: string } | null>(null);
  submitRate = signal<boolean>(false);

  constructor() {
    effect(() => {
      const rate = this.selectedRate();
      if (rate) {
        this.ratingForm.patchValue({ score: rate.score });
      }
    });
  }

  ngOnInit() {
    this.ratingForm = this.fb.group({
      score: ['', [Validators.required]],
      description: ['', [Validators.maxLength(255)]],
    });
  }

  selectRate(rate: number): void {
    const selected = this.rates().find((r) => r.score === rate) || null;
    this.selectedRate.set(selected);
  }

  submitRatingForm(form: FormGroup) {
    if (form.valid) {
      const orderTrackingCode = this.bottomSheetService.data().trackingCode;
      const ratingData: RateOrderRequest = {
        score: form.value.score,
        description: form.value.description,
      };
      this.buyerOrderService.rateOrder(orderTrackingCode, ratingData).subscribe({
        next: (res) => {
          this.submitRate.set(true);
        },
        error: (error) => this.messageService.showErrorOfErrorResponse(error),
      });
    }
  }

  navigateToOrders() {
    this.route.navigate(['/home']).then();
  }
}
