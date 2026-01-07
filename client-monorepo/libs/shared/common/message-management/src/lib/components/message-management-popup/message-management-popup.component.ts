import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxNoticeService } from '@digipay/ngx-notice';
import { MessageTemplateEnum } from '../../data-access/models/message-template.enum';
import { Message, MessageManagementApiService } from '@client-monorepo/shared/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { NgxAvatarComponent } from '@digipay/ngx-avatar';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventManagementService } from '@client-monorepo/common/event-management';
declare const window: any;

@Component({
  selector: 'common-message-management-popup',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, NgxButtonComponent, NgxAvatarComponent, ApiImageModule],
  templateUrl: './message-management-popup.component.html',
  styleUrl: './message-management-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MessageManagementPopupComponent implements AfterViewInit {
  // inputs
  message = input<Message | null>(null);
  // services
  private ngxNoticeService = inject(NgxNoticeService);
  private actionHandlerService = inject(ActionHandlerService);
  private messageManagementApiService = inject(MessageManagementApiService);
  private destroyRef = inject(DestroyRef);
  private eventManagementService = inject(EventManagementService);

  // signals
  currentTemplate = computed(() => {
    switch (this.message()?.template) {
      case MessageTemplateEnum.SIMPLE:
        return this.simpleTemplate();
      case MessageTemplateEnum.BANNER:
        return this.bannerTemplate();
      case MessageTemplateEnum.AVATAR:
        return this.avatarTemplate();
      default:
        return this.simpleTemplate();
    }
  });
  // viewChild templates
  simpleTemplate = viewChild<TemplateRef<any>>('SIMPLE_POPUP_TEMPLATE');
  avatarTemplate = viewChild<TemplateRef<any>>('AVATAR_POPUP_TEMPLATE');
  bannerTemplate = viewChild<TemplateRef<any>>('BANNER_POPUP_TEMPLATE');

  ngAfterViewInit() {
    this.openPopup();
  }
  // methods
  private openPopup(): void {
    const template = this.currentTemplate();
    if (!template) return;
    this.ngxNoticeService.openModal({
      template: template,
      position: 'bottom-center',
    });
    this.ngxNoticeService.afterClosedSubject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      window.popupMessage = false;
    });
    this.readMessage();
  }

  private readMessage(): void {
    if (!this.message()?.messageId) return;
    this.messageManagementApiService
      .readMessageApi(this.message()?.messageId as string)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onCtaClicked(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['message', 'pop-up'],
      data: {
        target: `message-id: ${this.message()?.messageId} | message-title: ${this.message()?.title}`,
      },
      meta: `cta-link: ${this.message()?.parseCta?.link}`,
    });
    if (!this.message()?.parseCta?.link) return;
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
      .then(() => {
        this.closeModal();
      });
  }

  closeModal(): void {
    this.ngxNoticeService.closeModal();
  }

  protected readonly MessageTemplateEnum = MessageTemplateEnum;
}
