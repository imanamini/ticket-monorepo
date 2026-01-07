import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-change-ab-partition',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, FormsModule, NgxButtonComponent],
  templateUrl: './change-ab-partition.component.html',
  styleUrl: './change-ab-partition.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeAbPartitionComponent {
  partition = signal<string>(localStorage.getItem('ab_test_partition') || '');

  removePartition() {
    localStorage.removeItem('ab_test_partition');
    window.location.reload();
  }
  updatePartition() {
    localStorage.setItem('ab_test_partition', this.partition());
    window.location.reload();
  }
}
