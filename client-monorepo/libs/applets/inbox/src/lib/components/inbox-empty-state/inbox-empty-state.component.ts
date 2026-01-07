import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxIllustrationIcon } from '@digipay/ngx-illustration-icon';

@Component({
  selector: 'inbox-applet-inbox-empty-state',
  standalone: true,
  imports: [CommonModule, NgxIllustrationIcon, NgxStatusResultModule],
  templateUrl: './inbox-empty-state.component.html',
  styleUrl: './inbox-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxEmptyStateComponent {
  //services
  private readonly backHandlerService = inject(BackHandlerService);

  // inputs
  emptyMode = input<'empty' | 'no-filter-result'>('empty');

  // signals
  buttons = signal<Buttons[]>([
    {
      id: 'primary',
      style: 'fill',
      label: 'بازگشت',
      mode: 'form',
    },
  ]);

  goBack(): void {
    this.backHandlerService.goBack();
  }
}
