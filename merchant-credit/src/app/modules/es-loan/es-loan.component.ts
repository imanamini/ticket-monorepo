import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'es-loan',
  templateUrl: './es-loan.component.html',
  styleUrl: './es-loan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  storageService = inject(StorageService);

  ngOnInit() {
    const params = this.route.snapshot.params;
    if (params.ticket) {
      this.storageService.setTicket(params.ticket);
    }
    this.router.navigate(['home'], {
      relativeTo: this.route
    });
  }
}
