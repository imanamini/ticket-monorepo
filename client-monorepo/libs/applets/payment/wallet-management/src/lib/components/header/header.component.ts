import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DescriptionComponent } from '../description/description.component';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wallet-mng-applet-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeaderComponent {
  private bottomSheet = inject(NgxBottomSheetService)
  private backHandler = inject(BackHandlerService);

  public back(): void {
    this.backHandler.goBack();
  }

  public showDescription(): void {
    this.bottomSheet.openBottomSheet(DescriptionComponent, {});
  }
}
