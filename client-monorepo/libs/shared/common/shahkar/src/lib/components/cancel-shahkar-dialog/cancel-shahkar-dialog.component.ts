import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ReactiveFormsModule } from '@angular/forms';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-shahkar-cancel-shahkar-dialog',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './cancel-shahkar-dialog.component.html',
  styleUrl: './cancel-shahkar-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelShahkarDialogComponent {
  cancelClicked = output();
  confirmClicked = output();
}
