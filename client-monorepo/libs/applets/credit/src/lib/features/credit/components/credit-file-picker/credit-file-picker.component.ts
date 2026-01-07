import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'credit-app-file-picker',
  templateUrl: './credit-file-picker.component.html',
  styleUrls: ['./credit-file-picker.component.scss'],
  standalone: true,
  imports: [NgxBottomSheetHeaderComponent, NgxDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditFilePickerComponent {
  imageType = signal<string>('چک');
  showDelete = signal(false);
  showCamera = signal(false);
  bottomSheetService = inject(NgxBottomSheetService);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  constructor() {
    if (this.bottomSheetService.data().showDelete) {
      this.showDelete.set(true);
    }
    if (this.bottomSheetService.data().showCamera) {
      this.showCamera.set(true);
    }
    if (this.bottomSheetService.data().imageType) {
      this.imageType.set(this.bottomSheetService.data().imageType);
    }
  }

  actionClicked(action: any) {
    this.bottomSheetService.outputData.set({
      action,
      file: null,
    });
    this.close();
  }

  fileChange($event: any) {
    if ($event.target.files.length > 0) {
      const file = $event.target.files[0];
      $event.target.value = '';
      this.bottomSheetService.outputData.set({
        action: 'file',
        file,
      });
      this.close();
    }
  }

  openCamera() {
    this.bottomSheetService.outputData.set({
      action: 'camera',
    });
    this.close();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
