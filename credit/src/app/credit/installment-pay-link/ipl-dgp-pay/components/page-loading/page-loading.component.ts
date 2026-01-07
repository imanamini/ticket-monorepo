import { Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'page-loading',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NgStyle,
  ],
  templateUrl: './page-loading.component.html',
  styleUrls: ['./page-loading.component.scss']
})
export class PageLoadingComponent {

  @Input()
  active = false;

  @Input()
  height: string;

}
