import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { MessageManagementApiService } from './message-management-api.service';
import { Message, MessagesResponse } from '../models/messages-response';
import moment from 'jalali-moment';
import { StorageService } from '@client-monorepo/common/utilities';
import { MessageBadgeInterface } from '../models/message-badge.interface';
import { CATEGORY_BADGE_MAPPER } from '../models/category-badge-mapper';
import { DomSanitizer } from '@angular/platform-browser';
import { AppMessagingCategoryEnum } from '../models/message-categories.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageManagementService {
  // services
  private readonly messageManagementApiService = inject(MessageManagementApiService);
  private readonly storageService = inject(StorageService);
  private sanitizer = inject(DomSanitizer);

  // signals
  messages = signal<MessagesResponse | null>(null);
  hasNewMessage = computed(() => this.messages()?.messages.some((m) => !m.isRead && !m.isExpired) ?? false);
  cacheKey = signal<string>('');

  // methods
  private transformMessage(page = 0, pageSize = 20, categories?: number[]): Observable<MessagesResponse> {
    return this.messageManagementApiService.getAllMessagesApi(page, pageSize, categories).pipe(
      map((res: MessagesResponse) => ({
        ...res,
        messages: res?.messages.map((msg: Message) => ({
          ...msg,
          parseBadge: this.getBadgeByCategory(msg),
          parseCta: msg?.cta ? JSON.parse(msg.cta) : null,
          parseAvatar: msg?.avatar ? JSON.parse(msg.avatar) : null,
          scheduledDateFormatted: msg.scheduledDate ? moment(msg.scheduledDate).locale('fa').fromNow() : undefined,
          safeContent: this.sanitizer.bypassSecurityTrustHtml(msg.content), // content HTML-safe
        })),
      })),
      tap((result) => this.messages.set(result)),
    );
  }

  private getBadgeByCategory(msg: Message): MessageBadgeInterface | undefined {
    const categories: AppMessagingCategoryEnum[] = msg.categories ?? [];
    const matchedCategory = categories.find((category) => category in CATEGORY_BADGE_MAPPER);
    return matchedCategory !== undefined ? CATEGORY_BADGE_MAPPER[matchedCategory] : undefined;
  }

  getMessages(deleteCache = false, page = 0, pageSize = 20, categories?: number[]): Observable<MessagesResponse> {
    const cached = this.messages();
    const key = page.toString() + pageSize.toString() + categories?.join(',');
    if (cached && this.cacheKey() === key && !deleteCache) {
      return of(cached);
    }
    this.cacheKey.set(key);
    return this.transformMessage(page, pageSize, categories);
  }

  /**
   * Checks if the stored appMessage timestamp has expired.
   * TTL is set to 20 minutes (20 * 60 * 1000 ms).
   * Returns true if more than 20 minutes have passed since the last timestamp.
   */

  public isAppMessageExpired(ttl = 20 * 60 * 1000): boolean {
    const now = Date.now();
    const timeStamp = this.storageService.getAppMessageTimeStamp();
    if (!timeStamp) {
      return true;
    } else {
      return now - timeStamp > ttl;
    }
  }

  /**
   * Stores the current timestamp for the appMessage.
   */

  public setAppMessageTimeStamp(): void {
    this.storageService.setAppMessageTimeStamp(Date.now());
  }

  /**
   * Determines whether an alert message should be show.
   * Returns true if the timestamp is still valid and
   * no flag is set in sessionStorage to suppress showing it again.
   */

  public shouldShowAlertMessage(): boolean {
    return this.isAppMessageExpired() && !this.storageService.isMessageApiCall();
  }

  /**
   * Marks a single message as read by updating its `isRead` flag in the messages signal.
   */

  markMessageAsRead(messageId: string) {
    if (!messageId) return;
    this.messages.update((current) => {
      if (!current) return current;

      return {
        ...current,
        messages: current.messages.map((msg) => (msg.messageId === messageId ? { ...msg, isRead: true } : msg)),
      };
    });
  }

  /**
   * Marks all message as read by updating its `isRead` flag in the messages signal.
   */

  markAllMessagesAsRead() {
    this.messages.update((current) => {
      if (!current) return current;

      return {
        ...current,
        messages: current.messages.map((msg) => ({ ...msg, isRead: true })),
      };
    });
  }
}
