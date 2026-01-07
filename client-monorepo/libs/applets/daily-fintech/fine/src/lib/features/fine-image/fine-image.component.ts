import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Subscription } from 'rxjs';
import { FineApiService, FineConfigResponse } from '@client-monorepo/daily-fintech/vehicle-data';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'fine-applet-fine-image',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxSkeletonLoadingComponent, NgxButtonComponent],
  templateUrl: './fine-image.component.html',
  styleUrl: './fine-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineImageComponent implements OnInit {
  subscriptions: Subscription[] = [];

  config = signal<FineConfigResponse | null>(null);
  fineApiService = inject(FineApiService);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  sanitizer = inject(DomSanitizer);
  trackingCode?: string;
  violationId?: string;
  gettingImage = true;
  isLoading = signal(false);
  isError = signal(false);
  imageSrc = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    this.getConfig();
  }

  getConfig() {
    this.isLoading.set(true);
    this.isError.set(false);
    this.fineApiService.getConfig().subscribe({
      next: (res) => {
        this.config.set(res);
        this.listenToQueryParamChanges();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  private listenToQueryParamChanges() {
    this.route.queryParams.subscribe((params) => {
      if (params['trackingCode']) {
        this.trackingCode = params['trackingCode'];
        this.violationId = params['violationId'];
        this.getImage(params['trackingCode'], params['violationId']);
      }
    });
  }

  private getImage(trackingCode: string, violationId: string) {
    this.isLoading.set(false);
    this.gettingImage = true;
    this.fineApiService.getFineImage(trackingCode, violationId).subscribe({
      next: (res: any) => {
        this.imageSrc.set(this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${res?.imageContent}`));
        this.gettingImage = false;
      },
      error: (error: any) => {
        this.isError.set(true);
        this.gettingImage = false;
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  retry() {
    this.getConfig();
  }
}
