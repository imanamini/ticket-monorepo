import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';

export interface SelectionBoxConfig {
  label: string;
  selected: boolean;
  value: string;
  checkboxType?: boolean;
  template?: TemplateRef<any>;
  iconLabel?: string;
}

@Component({
  selector: 'common-ui-components-selection-box',
  standalone: true,
  imports: [CommonModule, NgxTrackableIdDirective, NgxIcon],
  templateUrl: './selection-box.component.html',
  styleUrl: './selection-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBoxComponent {
  checkboxType = input(true);
  config = input<SelectionBoxConfig>({} as SelectionBoxConfig);
  selectedOption = output<SelectionBoxConfig>();

  selectionBoxSelected() {
    this.selectedOption.emit(this.config());
  }
}
