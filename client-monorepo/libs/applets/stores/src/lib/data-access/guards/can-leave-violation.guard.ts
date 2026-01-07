import { CanDeactivateFn, Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { inject } from '@angular/core';
import { ViolationLeaveBottomSheetComponent } from '../../components/violation-leave-bottom-sheet/violation-leave-bottom-sheet.component';
import { map, take } from 'rxjs';
import { ViolationReportComponent } from '../../features/violation-report/violation-report.component';

export const canLeaveViolationGuard: CanDeactivateFn<ViolationReportComponent> = (component: ViolationReportComponent) => {
  const bottomSheetService = inject(NgxBottomSheetService);
  const router = inject(Router);
  if (component.violationService.sectionToShow() === 'STEPPER') {
    if (bottomSheetService.outputData() && bottomSheetService.outputData().showedBefore) return true;
    bottomSheetService.openBottomSheet(ViolationLeaveBottomSheetComponent, null, {
      noPadding: true,
    });
    return bottomSheetService.onClose.pipe(
      take(1),
      map(() => {
        const result = bottomSheetService.outputData();
        if (!result || !result.confirmed) {
          window.history.pushState(null, '', router.url);
          return false;
        }
        return true;
      }),
    );
  } else {
    return true;
  }
};
