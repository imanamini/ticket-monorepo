import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FakeButtonApiService } from './services/fake-button-api.service';

@Component({
  selector: 'app-fake-buttons',
  templateUrl: './fake-buttons.component.html',
  styleUrls: ['./fake-buttons.component.scss'],
  standalone: true
})
export class FakeButtonsComponent implements OnInit {

  redirectUrl;

  providerId;

  amount;

  trackingCode;

  constructor(
    private fakeButtonApiService: FakeButtonApiService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(({providerId, amount, redirectUrl}) => {
      this.redirectUrl = redirectUrl;
      this.providerId = providerId;
      this.amount = amount;
      this.trackingCode = (Math.random() + 1).toString(36).substring(7);
    });
  }
}
