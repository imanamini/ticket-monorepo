import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss', './shared.style.scss']
})
export class CreditComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
  ) {
  }

  ngOnInit(): void {
    const ticket = this.activatedRoute.snapshot.paramMap.get('ticket');
    this.storage.set({
      ticket,
    });
    this.router.navigate(['pay'], {
      relativeTo: this.activatedRoute,
    });
  }

}
