import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnInit, output, signal } from '@angular/core';
import { ScannerApiService } from '../data-access/services/scanner-api.service';
import { Barcode, CreditTypes } from '../data-access/models/barcode.model';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BarcodeLoadingService } from '../barcode-loading/service/barcode-loading.service';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'lib-barcode-provider-list',
  standalone: true,
  imports: [CommonModule, DpIconComponent, FormsModule, NgxRadioButtonComponent, NgxSkeletonLoadingComponent, NgxButtonComponent],
  templateUrl: './barcode-provider-list.component.html',
  styleUrl: './barcode-provider-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeProviderListComponent implements OnInit {
  data = model<CreditTypes[]>([]);
  selectCredit = output();

  private readonly message = inject(MessageService);
  private readonly api = inject(ScannerApiService);
  private readonly loadingService = inject(BarcodeLoadingService);
  bottomSheetService = inject<NgxBottomSheetService<Barcode>>(NgxBottomSheetService);
  creditIdSelectedItem = signal<CreditTypes | undefined>(undefined);
  loading = input<boolean>(false);
  skeletonArr = Array.from({ length: 2 });
  isChecked = false;
  disableCloseButton = computed<boolean>(() => this.data().filter((item) => item.isChecked).length === 0);

  ngOnInit(): void {
    this.getBarcodeData();
  }

  getBarcodeData() {
    if (this.bottomSheetService.data()?.length) {
      this.data.set(this.bottomSheetService.data());
    }
  }

  onSelectCreditType(data: CreditTypes) {
    const selectedItem = this.data().find((item) => item.creditId === data.creditId);
    if (!selectedItem) return;
    const resetData = this.data().map((item) => ({
      ...item,
      isChecked: selectedItem?.creditId == item.creditId ? !item.isChecked : false,
    }));
    this.creditIdSelectedItem.set(selectedItem);
    this.data.update(() => resetData);
  }

  public getBarcode() {
    if (this.loading()) {
      return;
    }
    const selected = this.creditIdSelectedItem();
    if (!selected) {
      return;
    }

    this.loadingService.timerLoading(this.api.getBarcode(selected.creditId)).subscribe({
      next: (data) => {
        this.closeBottomSheet({
          ...data,
          ttl: new Date().getTime() + data.ttl,
        });
      },
      error: (err) => {
        this.message.showErrorOfErrorResponse(err);
      },
    });
  }

  private closeBottomSheet(data: any) {
    this.bottomSheetService.closeBottomSheet();

    const output = {
      ...data,
      selectedCredit: this.creditIdSelectedItem(),
    };

    this.creditIdSelectedItem.set(undefined);
    this.data.update(() =>
      this.data().map((item) => ({
        ...item,
        isChecked: false,
      })),
    );
    this.bottomSheetService.outputData.set(output);
    this.selectCredit.emit(output);
  }
}
