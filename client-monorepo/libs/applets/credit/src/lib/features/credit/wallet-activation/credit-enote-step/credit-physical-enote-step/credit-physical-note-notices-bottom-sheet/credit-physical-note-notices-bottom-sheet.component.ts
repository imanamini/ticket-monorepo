import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PhysicalNoteNotices } from '../../../../data-access/models/credit/activation/enote-step/physical-note-notices';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditNoticesComponent } from '../../../../components/credit-notices/credit-notices.component';

@Component({
  selector: 'app-credit-physical-note-notices-bottom-sheet',
  templateUrl: './credit-physical-note-notices-bottom-sheet.component.html',
  styleUrl: './credit-physical-note-notices-bottom-sheet.component.scss',
  standalone: true,
  imports: [NgxButtonComponent, CreditNoticesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalNoteNoticesBottomSheetComponent {
  notices = PhysicalNoteNotices;
  bottomSheetService = inject(NgxBottomSheetService);
}
