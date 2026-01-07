import { Component, OnInit } from '@angular/core';
import { UiIconModule } from '../../../../shared/components/ui-icon/ui-icon.module';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-bnpl-landing-intro',
  standalone: true,
  imports: [
    UiIconModule,
    NgxButtonComponent
  ],
  templateUrl: './bnpl-landing-intro.component.html',
  styleUrl: './bnpl-landing-intro.component.scss'
})
export class BnplLandingIntroComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  scrollToElement(element: string): void {
    const el = document.getElementById(element);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }

  goToActivation(): void {
    this.router.navigateByUrl('/bnpl/activation').then(() => {
    });
  }
}
