import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FileApiService } from '@client-monorepo/common/file-api';

@Component({
  selector: 'profile-applet-guide',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideComponent implements OnInit {
  title = signal('');
  content = signal('');
  apiUrl = '';
  activatedRoute = inject(ActivatedRoute);
  fileApiService = inject(FileApiService);

  ngOnInit() {
    this.initialize();
  }

  initialize(): void {
    const mode = this.activatedRoute.snapshot.params['mode'];
    if (mode === 'app') {
      this.title.set('راهنمای اپلیکیشن دیجی‌پی');
      this.apiUrl = 'files/help';
    } else {
      this.title.set('راهنمای بخش دریافت وام');
      this.apiUrl = 'files/static/credit-help';
    }
    this.getPageContent();
  }

  getPageContent(): void {
    this.fileApiService.getGuidePage(this.apiUrl).subscribe({
      next: (res: any) => {
        const tempText = res.replace('Help', '');
        this.content.set(tempText);
      },
    });
  }
}
