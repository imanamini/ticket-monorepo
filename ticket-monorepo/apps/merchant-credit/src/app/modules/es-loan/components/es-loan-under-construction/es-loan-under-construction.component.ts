import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'es-loan-under-construction',
  templateUrl: './es-loan-under-construction.component.html',
  styleUrl: './es-loan-under-construction.component.scss'
})
export class EsLoanUnderConstructionComponent implements OnInit {
  storage = inject(StorageService);
  router = inject(Router);

  ngOnInit() {
  }

  goToDashboard() {
    const ticket = this.storage.getTicket();
    this.router.navigate([`es-loan/${ticket}/home`]);
  }

}
