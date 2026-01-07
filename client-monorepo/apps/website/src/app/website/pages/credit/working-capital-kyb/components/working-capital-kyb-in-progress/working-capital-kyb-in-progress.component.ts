import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-working-capital-kyb-in-progress',
  templateUrl: './working-capital-kyb-in-progress.component.html',
  standalone: true,
  imports: [NgxButtonComponent],
  styleUrls: ['./working-capital-kyb-in-progress.component.scss'],
})
export class WorkingCapitalKybInProgressComponent {
  private router = inject(Router);

  navigate() {
    this.router.navigateByUrl('merchants-seller');
  }
}
