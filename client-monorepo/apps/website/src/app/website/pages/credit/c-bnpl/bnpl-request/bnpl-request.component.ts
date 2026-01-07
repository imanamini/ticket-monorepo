import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BnplService } from './bnpl.service';
import { UserService } from '../../../../../core/services/user.service';
import { RequestFormComponent } from './request-form/request-form.component';
import { AvailableBnplComponent } from './available-bnpl/available-bnpl.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../../layout/base-layout/base-layout.component';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'app-bnpl-request',
  templateUrl: './bnpl-request.component.html',
  styleUrls: ['./bnpl-request.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgIf, AvailableBnplComponent, RequestFormComponent],
})
export class BnplRequestComponent implements OnInit {
  loaded = false;

  hasAvailableBnpl = false;
  private eventService = inject(NgxEventTrackerService);

  constructor(
    private router: Router,
    private bnplService: BnplService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.bnplService.hasAvailableBnpl().subscribe((res) => {
      this.loaded = true;
      this.hasAvailableBnpl = res;
      const queryObject = new URLSearchParams();
      const queryParams = this.route.snapshot.queryParams;
      for (const key in queryParams) {
        queryObject.set(key, queryParams[key]);
      }
      let eventName = 'GetBNPL_HasNot';

      if (this.hasAvailableBnpl) {
        eventName = 'GetBNPL_AlreadyHas';
      }

      this.userService.currentUser().then((user) => {
        this.eventService.sendEvent({
          userId: user.userId,
          eventName: eventName,
          eventData: queryObject,
        });
      });
    });
  }

  navigateToCBnpl() {
    this.router.navigate(['/bnpl/c-bnpl/.'], { queryParamsHandling: 'merge' });
  }
}
