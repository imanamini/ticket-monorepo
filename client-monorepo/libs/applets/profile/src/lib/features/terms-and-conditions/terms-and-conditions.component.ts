import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FileApiService } from '@client-monorepo/common/file-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'profile-applet-terms-and-conditions',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsAndConditionsComponent implements OnInit {
  content = signal<SafeHtml>('');

  private fileApiService = inject(FileApiService);
  private destroyRef = inject(DestroyRef);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.getContent();
  }

  getContent(): void {
    this.fileApiService
      .getTermsAndConditionPage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(res));
      });
  }
}
