import { Component, OnInit } from '@angular/core';
import { BorderColorsEnum } from '@digipay/ngx-divider';

@Component({
  selector: 'app-fund-provider-branch-info',
  templateUrl: './fund-provider-branch-info.component.html',
  styleUrls: ['./fund-provider-branch-info.component.scss']
})

export class FundProviderBranchInfoComponent implements OnInit {
  BorderColorsEnum = BorderColorsEnum;

  constructor() {
  }

  ngOnInit(): void {
  }

}


