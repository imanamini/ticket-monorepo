import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConflictService } from '../../data-access/services/conflict.service';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ConflictReportComponent } from '../../components/conflict-report/conflict-report.component';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { ConflictOrderRequest, ConflictReasonResponse } from '../../data-access/models/conflict.interface';
import { Subject, takeUntil } from 'rxjs';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-conflict-applet-conflict',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxButtonComponent],
  templateUrl: './conflict.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConflictComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  conflictService = inject(ConflictService);
  messageService = inject(MessageService);
  bottomSheetService = inject(NgxBottomSheetService);
  conflicts = signal<ConflictReasonResponse[]>([]);
  destroy$: Subject<void> = new Subject();

  ngOnInit() {
    this.getConflictList();
  }

  getConflictList() {
    this.conflictService
      .getConflictReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.conflicts.set(res.conflictReasons);
        },
        error: (error) => this.messageService.showErrorOfErrorResponse(error),
      });
  }

  conflictOrder(conflictCode: number) {
    const trackingCode = this.activatedRoute.snapshot.paramMap.get('trackingCode') || '';
    const data: ConflictOrderRequest = {
      trackingCode: trackingCode,
      code: conflictCode,
      customDescription: '',
    };
    this.conflictService.conflictOrder(data).subscribe({
      next: (res) => {
        if (res.result.status === 0) {
          this.bottomSheetService.openBottomSheet(ConflictReportComponent, {});
        }
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
