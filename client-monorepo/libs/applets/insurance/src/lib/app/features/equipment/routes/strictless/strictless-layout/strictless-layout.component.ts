import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'strictless-layout',
  templateUrl: './strictless-layout.component.html',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./strictless-layout.component.scss']
})
export class StrictlessLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
