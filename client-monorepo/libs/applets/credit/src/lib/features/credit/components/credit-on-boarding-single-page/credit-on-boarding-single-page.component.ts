import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CreditVideoPlayerDialogComponent } from '../credit-video-player-dialog/credit-video-player-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditAppBarComponent } from '../credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../credit-scrollable-view/credit-scrollable-view.component';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-on-boarding-single-page',
  templateUrl: './credit-on-boarding-single-page.component.html',
  styleUrls: ['./credit-on-boarding-single-page.component.scss'],
  standalone: true,
  imports: [
    NgxButtonComponent,
    NgxTrackableIdDirective,
    NgxCalloutComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditDigipayImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditOnBoardingSinglePageComponent {
  imageId = input<string>();
  title = input<string>();
  message = input<string>();
  subtitle = input<string>();
  messages = input<string[]>();
  buttonLabel = input<string>();
  guideVideoUrl = input<string>();
  description = input<string>();

  secondTitle = computed(() => (this.subtitle() ? this.subtitle() : this.title()));

  back = output<void>();
  next = output<void>();

  bottomSheetService = inject(NgxBottomSheetService);

  openGuideVideo() {
    this.bottomSheetService.openBottomSheet(CreditVideoPlayerDialogComponent, {
      videoUrl: this.guideVideoUrl(),
    });
  }
}
