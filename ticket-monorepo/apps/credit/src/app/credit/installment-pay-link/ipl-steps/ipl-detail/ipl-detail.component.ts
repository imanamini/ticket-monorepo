import { Component, computed, inject, signal } from '@angular/core';
import { IplService } from '../../services/ipl.service';
import { IplDetailService } from '../../services/ipl-detail/ipl-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IplDigipayEnglishName } from '../../data-access/ipl-digipay-english-name';

@Component({
  selector: 'ipl-detail',
  templateUrl: './ipl-detail.component.html',
  styleUrl: './ipl-detail.component.scss'
})
export class IplDetailComponent {

  // Services
  private iplService = inject(IplService);
  private iplDetailService = inject(IplDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals
  userInfo = signal(this.iplService.userInfo());
  emptyDebt = computed<boolean>(() => this.userInfo().totalDebt === 0);
  canAggregate = computed<boolean>(() =>
    this.userInfo().unPaidInstallments &&
    this.userInfo().unPaidInstallments.length > 0
  );
  debtorInfoTitle = computed(() => {
    return this.userInfo().fundProviderDto.name === IplDigipayEnglishName ?
      'بدهی اعتبار اقساطی ' :
      this.userInfo().fundProviderDto.title.replace('اعتبار', 'وام');
  });

  goToApp() {
    this.iplDetailService.goToApp();
  }

  goToCellNumberPage() {
    this.router.navigate(['cell-number'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

}
