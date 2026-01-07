import { Component, OnInit } from '@angular/core';
import { WalletApiService } from '../../api/wallet-api.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-wallet-test',
  templateUrl: './wallet-test.component.html',
  styleUrls: ['./wallet-test.component.scss']
})
export class WalletTestComponent implements OnInit {

  accessToken: string;

  subscriptionAccessToken: string;

  subscriptionAuthData = {
    username: 'dk-ipg-test',
    password: 'd1g1k@l@t3st',
    grant_type: 'password'
  };

  constructor(
    private api: WalletApiService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
    this.api.getAuthorization().subscribe(r => {
      this.accessToken = r.access_token;
      this.storageService.setAccessToken(this.accessToken);
    }, e => {
      alert('Error while getting the access token');
    });

    this.api.getAuthorization(this.subscriptionAuthData).subscribe(r => {
      this.subscriptionAccessToken = r.access_token;
    }, e => {
      alert('Error while getting the access token');
    });
  }
}
