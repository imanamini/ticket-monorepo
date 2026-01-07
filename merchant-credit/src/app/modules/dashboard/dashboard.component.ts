import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardApiService } from '../../api/clients/dashboard/dashboard-api.service';
import { StorageService } from '../../services/storage.service';
import { MessageService } from '../../core/message.service';
import { Merchant } from './sandbox/models/merchants.model';
import { DashboardService } from './sandbox/services/dashboard.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  merchants: Merchant[] = [];
  showLoadingScreen = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private api: DashboardApiService,
              private storageService: StorageService,
              private messageService: MessageService,
              private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    if (params.ticket) {
      this.storageService.setTicket(params.ticket);
    }
    this.showLoadingScreen = this.dashboardService.getSeenLoadingScreen();
    if (this.showLoadingScreen) {
      setTimeout(() => {
        this.showLoadingScreen = false;
        this.findProperDestination();
      }, 3000);
    }
  }

  private findProperDestination(): void {
    this.api.getMerchants().subscribe(res => {
      this.merchants = res.merchants;
      const businessRegistrationUrl = res.businessRegistrationUrl;
      const businessSettlementUrl = res.businessSettlementUrl;
      sessionStorage.setItem('businessUrl', businessRegistrationUrl);
      sessionStorage.setItem('businessSettlementUrl', businessSettlementUrl);
      this.router.navigate(['home'], {
        relativeTo: this.route
      });
    }, error => {
      this.messageService.showErrorIfExists(error);
    });

  }

}
