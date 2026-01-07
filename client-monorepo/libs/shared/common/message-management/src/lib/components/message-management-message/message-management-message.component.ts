import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageManagementApiService, MessageManagementService } from '@client-monorepo/shared/common';
import { MessageTemplateEnum } from '../../data-access/models/message-template.enum';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxAvatarComponent } from '@digipay/ngx-avatar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxStatusLightComponent, StatusLightBordersEnum, StatusLightColorsEnum, StatusLightSizesEnum } from '@digipay/ngx-status-light';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'common-message-management-message',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, NgxButtonComponent, ApiImageModule, NgxAvatarComponent, NgxStatusLightComponent],
  templateUrl: './message-management-message.component.html',
  styleUrl: './message-management-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MessageManagementMessageComponent {
  // services
  private readonly actionHandlerService = inject(ActionHandlerService);
  private readonly messageApiService = inject(MessageManagementApiService);
  private readonly messageManagementService = inject(MessageManagementService);
  private readonly destroyRef = inject(DestroyRef);
  private eventManagementService = inject(EventManagementService);

  // inputs
  message = input<Message | null>(null);

  // signals
  isRead = signal(false);

  getMessageBackgroundClass = computed<string>(() => {
    const message = this.message();

    if (!this.isRead() && !message?.isRead && !message?.isExpired) {
      return 'unread-background';
    }
    if (message?.isExpired) {
      return 'surface-back';
    }
    return '';
  });

  getMessageDisableClass = computed<string>(() => {
    const message = this.message();
    if (message?.isExpired) return 'text-onback-disabled';
    return '';
  });

  onMessageClicked(): void {
    if (!this.message()?.messageId) return;
    if (!this.message()?.isRead && !this.isRead()) {
      this.isRead.set(true);
      this.messageManagementService.markMessageAsRead(this.message()?.messageId as string);
      this.messageApiService
        .readMessageApi(this.message()?.messageId as string)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
    if (!this.message()?.parseCta?.link || this.message()?.isExpired) return;
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['message', 'inbox'],
      data: {
        target: `message-id: ${this.message()?.messageId} | message-title: ${this.message()?.title}`,
      },
      meta: `cta-link: ${this.message()?.parseCta?.link}`
    });
    this.actionHandlerService
      .handle({
        type: ActionType.REDIRECT,
        payload: {
          url: this.message()?.parseCta?.link as string,
          type: this.actionHandlerService.isExternalUrl(this.message()?.parseCta?.link as string)
            ? RedirectionTypeEnum.blank
            : RedirectionTypeEnum.self,
        },
      })
      .then();
  }
  protected readonly MessageTemplateEnum = MessageTemplateEnum;
  protected readonly StatusLightSizesEnum = StatusLightSizesEnum;
  protected readonly StatusLightBordersEnum = StatusLightBordersEnum;
  protected readonly StatusLightColorsEnum = StatusLightColorsEnum;
}
