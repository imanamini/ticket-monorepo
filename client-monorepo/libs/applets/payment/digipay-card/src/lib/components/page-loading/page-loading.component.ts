import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PageLoadingService } from './page-loading.service';

@Component({
  selector: 'digipay-card-applet-page-loading',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './page-loading.component.html',
  styleUrl: './page-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoadingComponent {
  loadingService = inject(PageLoadingService);
  loading = computed(() => this.loadingService.loading());
}
