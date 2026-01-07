import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DeliveryFeedBacks } from '@client-monorepo/common/rate';

@Component({
  selector: 'common-rate-delivery-feedback',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './delivery-feedback.component.html',
  styleUrl: './delivery-feedback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryFeedbackComponent {
  protected readonly FeedbackModel = DeliveryFeedBacks;

  activeOne = signal<DeliveryFeedBacks | undefined>(undefined);
  feedbackSubmitted = output<DeliveryFeedBacks>();

  handleClick(type: DeliveryFeedBacks): void {
    if (type !== this.activeOne()) {
      this.activeOne.set(type);
      this.feedbackSubmitted.emit(type);
    }
  }
}
