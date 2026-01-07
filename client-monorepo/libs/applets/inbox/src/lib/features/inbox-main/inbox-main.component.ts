import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import {
  Message,
  MessageManagementApiService,
  MessageManagementMainComponent,
  MessageManagementService,
  MessagesResponse,
  MessageViewEnum,
} from '@client-monorepo/shared/common';
import { InboxEmptyStateComponent } from '../../components/inbox-empty-state/inbox-empty-state.component';
import { InboxSkeletonLoadingComponent } from '../../components/inbox-skeleton-loading/inbox-skeleton-loading.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { InboxFiltersComponent } from '../../components/inbox-filters/inbox-filters.component';
import { Router } from '@angular/router';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'inbox-applet-inbox-main',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    InboxEmptyStateComponent,
    InboxSkeletonLoadingComponent,
    MessageManagementMainComponent,
    InboxFiltersComponent,
    ScrolledToEndDirective,
  ],
  templateUrl: './inbox-main.component.html',
  styleUrl: './inbox-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxMainComponent implements OnInit, OnDestroy {
  // services
  private readonly messageManagementService = inject(MessageManagementService);
  private readonly messageApiService = inject(MessageManagementApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly backHandlerService = inject(BackHandlerService);

  // signals
  pageStatus = signal<'loading' | 'empty' | 'loaded' | 'no-filter-result'>('loading');
  messages = signal<Message[]>([]);

  // privates
  private activeCategories = signal<number[]>([]);
  private isAllReadClicked = signal(false);

  // computed
  isDisableAllReadButton = computed(() => {
    return this.isAllReadClicked() || this.pageStatus() == 'no-filter-result';
  });

  isShowAllReadButton = computed(() => {
    return this.pageStatus() !== 'empty';
  });

  // for pagination
  private hasNextPage = signal(false);
  private pageSize = signal(20);
  private page = signal(0);

  ngOnInit() {
    this.backHandlerService.disableAutoScroll();
    this.getMessages();
  }

  listEnded(): void {
    if (this.hasNextPage() && this.pageStatus() === 'loaded') {
      this.page.update((prev) => prev + 1);
      this.getMessages(false, this.activeCategories());
    }
  }
  onAllReadCalled(): void {
    this.isAllReadClicked.set(true);
    this.messages.update((messages: Message[]) => messages.map((message: Message) => ({ ...message, isRead: true })));
    this.messageManagementService.markAllMessagesAsRead();
    this.messageApiService
      .readAllMessagesApi()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.messageService.showErrorOfErrorResponse(err);
        },
      });
  }

  private getMessages(deleteCache = false, categories?: number[], scrollToTop = false): void {
    if (deleteCache) {
      this.pageStatus.set('loading');
    }
    this.messageManagementService
      .getMessages(deleteCache, this.page(), this.pageSize(), categories)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: MessagesResponse) => {
          const newMessages = res?.messages ?? [];

          if (!newMessages.length) {
            const isEmpty = !categories || categories.length === 0;
            this.pageStatus.set(isEmpty ? 'empty' : 'no-filter-result');
            if (deleteCache) this.messages.set([]);
            return;
          }
          this.hasNextPage.set(res?.hasNext ?? false);

          if (deleteCache) {
            this.messages.set(newMessages);
          } else {
            this.messages.update((oldMessages) => [...oldMessages, ...newMessages]);
          }

          this.pageStatus.set('loaded');

          if (scrollToTop) {
            this.scrollToFirst();
          }
        },
        error: (err) => {
          this.messageService.showErrorOfErrorResponse(err);
          this.router.navigateByUrl('/').then();
        },
      });
  }

  onFilterClicked(filter: number[]) {
    this.page.set(0);
    this.activeCategories.set(filter);
    this.getMessages(true, filter, true);
  }

  private scrollToFirst(): void {
    const element = document.getElementById('filter-container');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  ngOnDestroy(): void {
    this.backHandlerService.enableAutoScroll();
  }

  protected readonly MessageViewEnum = MessageViewEnum;
}
