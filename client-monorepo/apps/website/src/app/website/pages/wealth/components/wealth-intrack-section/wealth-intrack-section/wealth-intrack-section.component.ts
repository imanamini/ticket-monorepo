import {Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../../../../../core/services/user.service';
import {DialogBottomSheetService} from '../../../../../../core/services/dialog-bottom-sheet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxStatusResultModule} from '@digipay/ngx-status-result';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {UiButtonComponent} from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {UiIconDirective} from '../../../../../../ui/ui-directive/ui-icon.directive';
import {NgxEventTrackerService} from '@digipay/ngx-event-tracker';
import {UrlService} from "../../../../../services/url.service";

@Component({
  selector: 'app-wealth-intrack-section',
  templateUrl: './wealth-intrack-section.component.html',
  styleUrls: ['./wealth-intrack-section.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, NgIf, NgxStatusResultModule, UiIconDirective],
})
export class WealthIntrackSectionComponent implements OnInit {
  showThanksMsg = false;
  private eventService = inject(NgxEventTrackerService);
  private urlService = inject(UrlService);

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) public platformId: string,
    private dialog: DialogBottomSheetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const queryParams = this.activatedRoute.snapshot.queryParams;
      if (isPlatformBrowser(this.platformId) && this.userService.isLoggedIn.getValue() && queryParams.sendEvent === '1') {
        this.sendIntrackEvent();
        this.router.navigate([], {
          queryParams: {
            sendEvent: null,
          },
          queryParamsHandling: 'merge',
        });
      }
    }
  }

  onClickGetSejam() {
      this.urlService.handleLink('https://profilesejam.csdiran.ir/');
  }

  sendIntrackEvent() {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.currentUser().then((user) => {
        this.eventService.sendEvent({
          eventName: 'GSC_S',
          eventData: {
            UUID: user.userId,
            PhoneNumber: user.cellNumber,
            OriginURL: window.location.href,
          },
        });
      });
    }
  }
}
