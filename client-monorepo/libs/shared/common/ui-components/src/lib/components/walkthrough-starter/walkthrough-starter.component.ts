import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NAVIGATION_WALK_THROUGH_CONFIG } from '../../data-access/constants/navigation-walk-through.const';
import { HUB_WALKTHROUGH_CONFIG } from '../../data-access/constants/hub-walkthrough.const';
import { STORE_WALK_THROUGH_CONFIG } from '../../data-access/constants/stores-walkthrough.const';
import { TRANSACTION_WALKTHROUGH_CONFIG } from '../../data-access/constants/transaction-walkthrough.const';
import { PROFILE_WALKTHROUGH_CONFIG } from '../../data-access/constants/profile-walkthrough.const';
import { WalkThroughService } from '@client-monorepo/shared/common/walk-through';
import { HOME_WALKTHROUGH_CONFIG } from '../../data-access/constants/home-walkthrough.const';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'common-ui-components-walkthrough-starter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './walkthrough-starter.component.html',
  styleUrl: './walkthrough-starter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalkthroughStarterComponent implements OnInit, OnDestroy {
  secondsRemaining = signal(8);
  walkthroughService = inject(WalkThroughService);
  bottomSheetService = inject(NgxBottomSheetService);
  interval!: NodeJS.Timer;

  ngOnInit(): void {
    this.showWalkThrough();
  }

  intervalStart(): void {
    this.interval = setInterval(() => {
      this.secondsRemaining.update((ex) => {
        if (ex === 1) {
          this.bottomSheetService.closeBottomSheet();
          this.showWalkThrough();
        }
        ex--;
        return ex;
      });
    }, 1000);
  }

  showWalkThrough(): void {
    const walkThroughConfigs = [
      NAVIGATION_WALK_THROUGH_CONFIG,
      HOME_WALKTHROUGH_CONFIG,
      HUB_WALKTHROUGH_CONFIG,
      STORE_WALK_THROUGH_CONFIG,
      TRANSACTION_WALKTHROUGH_CONFIG,
      PROFILE_WALKTHROUGH_CONFIG,
    ];
    this.walkthroughService.manageWalkThrough(walkThroughConfigs);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
