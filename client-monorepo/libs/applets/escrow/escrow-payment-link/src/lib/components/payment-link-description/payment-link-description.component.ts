import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentLinkDescriptionConfig } from '../../data-access/model/payment-link-description.model';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-payment-link-description',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl:
   './payment-link-description.component.html',
  styleUrl: './payment-link-description.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentLinkDescriptionComponent {
  readonly config = input<PaymentLinkDescriptionConfig>();
  readonly noAction = input(false);

  @Output() readAll: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly description = computed(() => this.config()?.descriptionEnum[0] ?? '');

  public done(): void {
    this.readAll.emit(true);
  }
}
