import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreService } from '../../data-access/services/store.service';

@Component({
  selector: 'order',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  private storeService = inject(StoreService);

  ngOnInit(): void {
    this.initStoreData();
  }

  initStoreData(): void {
    this.storeService.loadAuthorizedApplicationData();
  }
}
