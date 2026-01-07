import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private configService: ConfigService) {
  }

  ngOnInit(): void {

  }

  proceed() {
    this.router.navigate(['../home'], {
      relativeTo: this.route
    });
  }

  onCloseClick(): void {
    this.configService.exit();
  }

}
