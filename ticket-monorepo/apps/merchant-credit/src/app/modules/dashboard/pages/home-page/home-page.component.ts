import { Component, OnInit } from '@angular/core';
import { Merchant } from '../../sandbox/models/merchants.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { DashboardApiService } from '../../../../api/clients/dashboard/dashboard-api.service';
import { MessageService } from '../../../../core/message.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HomeHelpBottomSheetComponent } from '../../components';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  merchants: Merchant[] = [];
  totalRemainingCreditAmount: number = 0;
  ticket: string = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private api: DashboardApiService,
              private storage: StorageService,
              private bottomSheet: MatBottomSheet,
              private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.getMerchantsData();
  }

  getMerchantsData() {
    this.api.getMerchants().subscribe(res => {
      this.merchants = res.merchants;
      this.totalRemainingCreditAmount = res.totalRemainingCreditAmount;
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
  }

  enrollNew() {
    const ticket = this.storage.getTicket();
    this.router.navigate(['/rules-selection'], {
      queryParams: {
        ticket
      }
    });
  }

  continueJourney(creditId: string) {
    this.router.navigate(['/registration-v2', creditId]
    );
  }

  onBackClick() {
    this.configService.exit();

  }

  onHelpClick() {
    this.bottomSheet.open(HomeHelpBottomSheetComponent, {
      panelClass: ['digipay-bottom-sheet', 'no-padding']
    });
  }

}
