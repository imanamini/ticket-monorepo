import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'layout',
  templateUrl: './equipment-layout.component.html',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./equipment-layout.component.scss']
})
export class EquipmentLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
