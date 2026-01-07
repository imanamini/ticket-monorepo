import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { RouterOutlet } from '@angular/router';
import { CashOutStateService } from '../../data-access/services/cash-out-state.service';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'cash-out-applet-layout',
  standalone: true,
  imports: [PageLayoutComponent, RouterOutlet],
  templateUrl: './cash-out-layout.component.html',
  styleUrl: './cash-out-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CashOutStateService],
})
export class CashOutLayoutComponent implements OnDestroy {
  private readonly state = inject(CashOutStateService);
  private readonly backHandler = inject(BackHandlerService);
  onBack() {
    this.backHandler.goBack();
  }

  ngOnDestroy(): void {
    this.state.dispatch({ type: 'CLEAR_STORAGE' });
  }
}
