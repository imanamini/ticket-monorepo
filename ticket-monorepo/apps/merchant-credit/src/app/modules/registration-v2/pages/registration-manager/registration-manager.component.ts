import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../registration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'registration-manager',
  templateUrl: './registration-manager.component.html',
  styleUrls: ['./registration-manager.component.scss'],
  providers: [
    RegistrationService,
  ],
})
export class RegistrationManagerComponent implements OnInit {

  constructor(
    private service: RegistrationService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    if (params.creditId) {
      this.service.creditId = params.creditId;
    }
  }
}
