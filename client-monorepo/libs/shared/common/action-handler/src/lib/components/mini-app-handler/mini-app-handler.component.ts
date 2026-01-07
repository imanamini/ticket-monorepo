import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActionHandlerService } from '../../data-access/services/action-handler.service';
import { ActionType } from '../../data-access/models/action-type';
import { RedirectionTypeEnum } from '../../data-access/models/redirection-type.enum';
import { HandleTypeEnum } from '../../data-access/models/action-handler-result.interface';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { EventManagementService } from '@client-monorepo/common/event-management';

declare const window: any;

@Component({
  selector: 'common-action-handler-mini-app-handler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-app-handler.component.html',
  styleUrl: './mini-app-handler.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniAppHandlerComponent implements OnInit {
  route = inject(ActivatedRoute);
  actionHandler = inject(ActionHandlerService);
  backHandler = inject(BackHandlerService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  eventManagementService = inject(EventManagementService);

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}
  ngOnInit() {
    this.eventManagementService.sendEvents();
    this.bottomNavigationService.hide();
    if (this.environment['env'] !== 'local') {
      this.redirectToMiniApp();
    } else {
      this.backHandler.goBack();
    }
  }

  redirectToMiniApp() {
    this.actionHandler
      .handle({
        type: ActionType.REDIRECT,
        payload: {
          url: window.location.href,
          hybridCloseAction: false,
          type: RedirectionTypeEnum.self_instance,
        },
      })
      .then((result) => {
        if (result.handleType !== HandleTypeEnum.self) {
          this.backHandler.goBack();
        }
      });
  }
}
