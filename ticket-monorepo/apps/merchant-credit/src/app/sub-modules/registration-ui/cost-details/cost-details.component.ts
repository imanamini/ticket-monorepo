import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cost-details',
  templateUrl: './cost-details.component.html',
  styleUrls: ['./cost-details.component.scss']
})
export class CostDetailsComponent implements OnInit {

  @Input()
  items: {
    title: string,
    subtitle?: string,
    amount: number
  }[] = [];

  @Input()
  unit = 'ریال';

  constructor() {
  }

  ngOnInit(): void {
  }

}
