import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { HybridVersion, NgxHybridService } from '@digipay/ngx-hybrid-service';

@Component({
  selector: 'lib-native-version-sheet',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './native-version-sheet.component.html',
  styleUrl: './native-version-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeVersionSheetComponent implements OnInit {
  private bottomSheetService = inject(NgxBottomSheetService);
  private ngxHybridService = inject(NgxHybridService);
  currentVersion = signal('');
  newVersion: Signal<string> = computed(() => {
    return this.bottomSheetService.data().newVersion;
  });

  ngOnInit() {
    this.loadCurrentVersion().then();
  }

  private async loadCurrentVersion() {
    const result: HybridVersion = await this.ngxHybridService.getHybridVersion();
    this.currentVersion.set(result.appVersion);
  }
  onUpdateClicked(): void {
    this.bottomSheetService.closeBottomSheet();
    this.bottomSheetService.outputData.set({ isAllowed: true });
  }
  onRemindLaterClicked(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
