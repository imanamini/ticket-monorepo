import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxListItemComponent } from '@digipay/ngx-list-item';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { ViolationBottomSheetItemModel } from '../../data-access/models/violation.model';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'stores-applet-violation-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxListItemComponent, TitleSummaryComponent, NgxBottomSheetHeaderComponent, NgxDividerComponent],
  templateUrl: './violation-bottom-sheet.component.html',
  styleUrl: './violation-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationBottomSheetComponent implements OnInit {
  // Injections
  bottomSheetService = inject(NgxBottomSheetService);

  // Variables
  items = signal<ViolationBottomSheetItemModel[]>([]);
  title = signal<string>('');

  icon = { name: 'arrow-2-left', type: 'linear', classes: 'text-onback-brand' };
  BorderColorsEnum = BorderColorsEnum;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const data = this.bottomSheetService.data();
    if (!data.items) {
      this.close();
    }
    this.items.set(data.items);
    this.title.set(data.title);
  }

  handleItemClick(item: ViolationBottomSheetItemModel) {
    this.bottomSheetService.outputData.set(item.storeType);
    this.close();
  }

  close(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
