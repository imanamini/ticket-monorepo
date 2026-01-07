import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gray-card-layout',
  templateUrl: './gray-card-layout.component.html',
  styleUrls: ['./gray-card-layout.component.scss']
})
export class GrayCardLayoutComponent implements OnInit {

  @Input()
  noPadding: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
