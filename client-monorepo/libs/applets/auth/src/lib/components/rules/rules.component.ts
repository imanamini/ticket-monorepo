import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileApiService } from '@client-monorepo/common/file-api';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'auth-applet-rules',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent implements OnInit {
  content = signal('');
  onBackClicked = output<void>();

  fileApiService = inject(FileApiService);

  ngOnInit(): void {
    this.getContent();
  }

  getContent(): void {
    this.fileApiService.getTermsAndConditionPage().subscribe((res: any) => {
      this.content.set(res);
    });
  }
  onBackActionClicked(): void {
    this.onBackClicked.emit();
  }
}
