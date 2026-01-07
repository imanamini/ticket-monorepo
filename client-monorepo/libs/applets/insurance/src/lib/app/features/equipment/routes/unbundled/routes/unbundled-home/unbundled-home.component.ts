import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnbundledService } from './services/unbundled.service';
import { LeadServiceComponent } from './partials/lead-service/lead-service.component';
import { NgIf } from '@angular/common';
import { AboutServiceComponent } from './partials/about-service/about-service.component';
import {
  AdvantageHorizontalListComponent
} from './partials/advantage-horizontal-list/advantage-horizontal-list.component';
import { HowToUseComponent } from './partials/how-to-use/how-to-use.component';

@Component({
  selector: 'app-unbundled-home-index',
  templateUrl: './unbundled-home.component.html',
  styleUrls: ['./unbundled-home.component.scss'],
  providers: [
    UnbundledService
  ],
  imports: [
    LeadServiceComponent,
    NgIf,
    AboutServiceComponent,
    AdvantageHorizontalListComponent,
    HowToUseComponent
  ],
  standalone: true
})
export class UnbundledHomeComponent implements OnInit {

  code = '';

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(({code}) => {
      this.code = code;
    });
  }

}
