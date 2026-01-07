import { Component } from '@angular/core';
import { InsuranceHeaderComponent } from '../../components/insurance-header/insurance-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'claim',
  standalone: true,
  imports: [
    InsuranceHeaderComponent,
    RouterOutlet
  ],
  templateUrl: './claim.component.html',
  styleUrl: './claim.component.scss'
})
export class ClaimComponent {

}
