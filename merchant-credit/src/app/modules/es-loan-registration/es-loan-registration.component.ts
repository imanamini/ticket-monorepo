import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'es-loan-registration',
  templateUrl: './es-loan-registration.component.html',
  styleUrl: './es-loan-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanRegistrationComponent implements OnInit {

  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
  }
}

