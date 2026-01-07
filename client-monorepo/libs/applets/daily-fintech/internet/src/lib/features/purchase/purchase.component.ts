import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { BundleCategory, InternetPurchaseResponse } from '../../data-access/models/internet-purchase.response';
import { BadgeComponentComponent } from '../../components/badge-component/badge-component.component';
import { InternetPackageComponent } from '../../components/internet-package/internet-package.component';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'internet-applet-purchase',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, BadgeComponentComponent, InternetPackageComponent],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseComponent implements OnInit {
  @ViewChild('sectionsContainer', { static: false }) sectionsContainer!: ElementRef;

  purchaseData = signal<InternetPurchaseResponse>({} as InternetPurchaseResponse);
  bundleCategory = signal<BundleCategory[]>([]);
  selectedItem = signal<BundleCategory[]>([]);
  route = inject(ActivatedRoute);
  router = inject(Router);
  messagesService = inject(MessageService);

  ngOnInit(): void {
    this.route.paramMap.pipe(map(() => window.history.state)).subscribe((data) => {
      const responseData = data?.response;
      if (responseData && responseData.result && responseData.bundleCategories?.length) {
        this.purchaseData.set({
          result: responseData.result,
          bundleCategories: responseData.bundleCategories,
        });
        this.bundleCategory.set(this.purchaseData().bundleCategories);
      } else {
        this.messagesService.showErrorMessage('بسته فعالی وجود ندارد');
        this.router.navigateByUrl('/internet', { replaceUrl: true }).then();
      }
    });
    if (this.bundleCategory().length === 0) {
      this.router.navigateByUrl('/internet', { replaceUrl: true }).then();
      return;
    }
  }

  onSelectBadge(event: string) {
    if (event === 'همه') {
      this.selectedItem.set(this.bundleCategory());
      return;
    }
    const selected = this.bundleCategory().filter((item) => item.title === event);
    this.selectedItem.set(selected);
  }
}
