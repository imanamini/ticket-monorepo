import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { InsuranceHeaderComponent } from '../../../../components/insurance-header/insurance-header.component';
import { Location } from '@angular/common';

@Component({
  selector: 'claim-register',
  standalone: true,
  imports: [
    InsuranceHeaderComponent,
    RouterOutlet
  ],
  templateUrl: './claim-register.component.html',
  styleUrl: './claim-register.component.scss'
})
export class ClaimRegisterComponent {

  private location = inject(Location);

  closeIconClick(): void {
    this.location.back();
  }
}
