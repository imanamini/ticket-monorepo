import { Component, OnInit } from '@angular/core';
import { IplService } from '../services/ipl.service';
import { ActivatedRoute } from '@angular/router';
import { RefererShortKey } from '../models/referer.model';

@Component({
  selector: 'app-ipl-layout',
  templateUrl: './ipl-layout.component.html',
  styleUrls: ['./ipl-layout.component.scss'],
})
export class IplLayoutComponent implements OnInit {

  constructor(
    public iplService: IplService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    const referer = this.route.snapshot.queryParamMap.get(RefererShortKey); // Referer shows from which referer user came
    this.iplService.setReferer(referer);
    this.iplService.setUserUuid(uuid);
    this.iplService.getInformation();
  }
}
