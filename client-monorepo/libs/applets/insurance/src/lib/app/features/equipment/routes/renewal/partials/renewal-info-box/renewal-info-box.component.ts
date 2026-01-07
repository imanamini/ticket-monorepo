import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'journey-info-box',
  templateUrl: './renewal-info-box.component.html',
  standalone: true,
  styleUrls: ['./renewal-info-box.component.scss']
})
export class RenewalInfoBoxComponent implements OnInit {

  constructor() {
  }

  @Input()
  title: string;

  @Input()
  description: string;

  ngOnInit(): void {
  }

}
