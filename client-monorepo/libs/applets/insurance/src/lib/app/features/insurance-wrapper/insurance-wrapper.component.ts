import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DpxService } from '../../data-access/services/dpx.service';

@Component({
  selector: 'insurance-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './insurance-wrapper.component.html',
  styleUrl: './insurance-wrapper.component.scss',
  encapsulation: ViewEncapsulation.None, // Required for Material overlays to receive styles
})
export class InsuranceWrapperComponent {

  private dpxService = inject(DpxService);
  private router = inject(Router);
}
