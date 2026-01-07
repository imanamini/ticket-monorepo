import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { CreditRootStyleService } from '../shared/services/credit-root-style.service';

@Component({
  selector: 'app-credit-root',
  templateUrl: './credit-root.component.html',
  styleUrls: ['./credit-root.component.scss'],
})
export class CreditRootComponent implements OnInit {

  styleService = inject(CreditRootStyleService);

  @HostBinding('style.background-color') backgroundColor = '';

  constructor() {
    if (!document.body.classList.contains('credit-module')) {
      document.body.classList.add('credit-module');
    }
  }

  ngOnInit() {
    this.styleService.getBackgroundColor().subscribe(color => this.backgroundColor = color);
  }

}
