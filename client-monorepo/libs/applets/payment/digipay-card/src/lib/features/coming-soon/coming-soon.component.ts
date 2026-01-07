import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ActivatedRoute } from '@angular/router';
import { ComingSoonFeature } from '../../data-access/models/digi-card-shared.model';
import { map } from 'rxjs';

const FEATURE_UI: Record<ComingSoonFeature, { featureTitle: string; pageTitle: string }> = {
  change: { featureTitle: 'تغییر رمز', pageTitle: 'تنظیمات رمز' },
  forgot: { featureTitle: 'فراموشی رمز', pageTitle: 'تنظیمات رمز' },
  activation: { featureTitle: 'فعال‌سازی کارت', pageTitle: 'فعال‌سازی کارت' },
  blocking: { featureTitle: 'مسدودسازی کارت', pageTitle: 'مسدودسازی کارت' },
  unblocking: { featureTitle: 'رفع مسدودی کارت', pageTitle: 'رفع مسدودی کارت' },
  attachment: { featureTitle: ' اتصال کارت', pageTitle: 'اتصال کارت' },
  'password-settings': { featureTitle: 'تنظیمات رمز', pageTitle: 'تنظیمات رمز' },
  unknown: { featureTitle: '', pageTitle: '' },
};

@Component({
  selector: 'digipay-card-applet-coming-soon',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, DpIconComponent, NgxButtonComponent],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent implements OnInit {
  backHandler = inject(BackHandlerService);
  route = inject(ActivatedRoute);
  feature = signal<{ featureTitle: string; pageTitle: string }>(FEATURE_UI['unknown']);
  pageTitle = signal<string>('');

  ngOnInit(): void {
    this.mapFeatureToQueryParam();
  }
  mapFeatureToQueryParam() {
    const feature: ComingSoonFeature = this.route.snapshot.queryParams['feature'];
    this.feature.set(FEATURE_UI[feature]);
  }
  goBack() {
    this.backHandler.goBack();
  }
}
