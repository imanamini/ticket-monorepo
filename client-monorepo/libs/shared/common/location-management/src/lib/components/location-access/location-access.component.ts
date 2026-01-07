import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import player from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'common-location-management-location-access',
  standalone: true,
  imports: [CommonModule, LottieComponent, NgxButtonComponent],
  templateUrl: './location-access.component.html',
  styleUrl: './location-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class LocationAccessComponent {
  locationAnimation = signal('/assets/location/location.json');
  private bottomSheetService = inject(NgxBottomSheetService);
  onAcceptClicked(): void {
    this.bottomSheetService.closeBottomSheet();
    this.bottomSheetService.outputData.set({ isAllowed: true });
  }
  onNotYetClicked(): void {
    this.bottomSheetService.closeBottomSheet();
    this.bottomSheetService.outputData.set({ isAllowed: false });
  }
}
