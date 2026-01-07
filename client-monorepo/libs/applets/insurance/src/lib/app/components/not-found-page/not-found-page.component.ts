import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, NgStyle]
})
export class NotFoundPageComponent implements OnInit {

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  redirect(): void {
    this.router.navigate(['/']).then();
  }
}
