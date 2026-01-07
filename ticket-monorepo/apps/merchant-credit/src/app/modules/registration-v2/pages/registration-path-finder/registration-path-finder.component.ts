import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../registration.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'registration-path-finder',
  templateUrl: './registration-path-finder.component.html',
  styleUrls: ['./registration-path-finder.component.scss']
})
export class RegistrationPathFinderComponent implements OnInit {

  constructor(
    private service: RegistrationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findProperDestination();
  }

  private findProperDestination(): void {
    const creditId = this.service.creditId;
    this.service.getTicketDetail().subscribe(res => {
      if (res.registration.fundProvider === 'middle-east') {
        this.router.navigate(['overview'], {
          relativeTo: this.route,
          replaceUrl: true
        });
      } else if (res.registration.fundProvider === 'saman') {
        this.router.navigate(['/registration-v3'], {
          queryParams: {
            creditId
          },
          replaceUrl: true
        });
      } else {
        this.router.navigate(['/registration'], {
          queryParams: {
            creditId
          },
          replaceUrl: true
        });
      }
    });
  }

}
