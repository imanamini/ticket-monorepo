import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-found-provider-logo',
  templateUrl: './found-provider-logo.component.html',
  styleUrls: ['./found-provider-logo.component.scss']
})
export class FoundProviderLogoComponent implements OnInit {

  @Input()
  logo: string;
  @Input()
  color: string;

  constructor() { }

  ngOnInit() {
  }

}
