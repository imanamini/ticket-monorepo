import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { ContractDetail } from '../../data-access/models/credit/contracts/credit-contract-detail.response';
import { animate, style, transition, trigger } from '@angular/animations';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-contract-detail',
  templateUrl: './credit-contract-detail.component.html',
  styleUrls: ['./credit-contract-detail.component.scss'],
  animations: [
    trigger('subItems', [
      transition('void => in', [style({ height: '0px' }), animate(300, style({ height: '*' }))]),
      transition('in => void', [style({ height: '*' }), animate(300, style({ height: '0px' }))]),
    ]),
  ],
  standalone: true,
  imports: [CreditAppBarComponent, CreditScrollableViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditContractDetailComponent implements OnInit {
  fundProviderCode!: number;
  creditId!: string;
  trackingCode!: string;
  contractDetails = signal<ContractDetail[] | null>(null);
  extendedSection = signal<{ [key: string]: boolean }>({});

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);

  ngOnInit() {
    this.fundProviderCode = this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.trackingCode = this.activatedRoute.snapshot.params['contractTrackingCode'];
    this.getData();
  }

  getData() {
    this.creditApiService.getCreditContractDetail(this.trackingCode, this.fundProviderCode).subscribe((response) => {
      this.contractDetails.set(response.contractDetails);
    });
  }

  updateExtendedSection(i: number, j: number) {
    this.extendedSection.update((item) => ({
      ...item,
      [i + '_' + j]: ![i + '_' + j],
    }));
  }

  backButtonClick() {
    window.history.back();
  }
}
