import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ReferralData, UserApiService } from '@client-monorepo/common/user';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-referral',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    NgOptimizedImage,
    DpIconComponent,
    NgxSkeletonLoadingComponent,
    CdkCopyToClipboard,
    NgxButtonComponent,
  ],
  templateUrl: './referral.component.html',
  styleUrl: './referral.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralComponent implements OnInit {
  userApiService = inject(UserApiService);
  ngxHybridServiceService = inject(NgxHybridServiceService);
  data = signal<ReferralData | null>(null);
  private ms = inject(MessageService);
  invitationUrl = signal('');
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    this.invitationUrl.set(this.environment['app_url'] + '?referralCode=');
  }
  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.userApiService.getReferralInfo().subscribe((res) => {
      this.data.set(res);
    });
  }

  shareButton() {
    const content = this.data()?.content;
    if (!content) {
      return;
    }
    if (this.ngxHybridServiceService.isHybrid()) {
      this.ngxHybridServiceService.shareText(content);
      return;
    }
    const n = navigator as any;
    if (n.share) {
      n.share({
        text: content,
      });
    } else {
      this.ms.showErrorMessage('این عمل توسط دستگاه شما پشتیبانی نمی‌شود');
    }
  }
}
