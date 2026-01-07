import { Component, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'ipl-header',
  templateUrl: './ipl-header.component.html',
  styleUrls: ['./ipl-header.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent],
})
export class IplHeaderComponent {
  backUrl = input();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  backHandler() {
    this.router.navigate([`../${this.backUrl()}`], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }
}
