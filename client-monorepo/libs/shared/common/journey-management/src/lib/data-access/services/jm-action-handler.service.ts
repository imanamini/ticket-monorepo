import { inject, Injectable } from '@angular/core';
import { Action } from '../models/na-backend.interface';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { JourneyManagerActions } from '@client-monorepo/common/journey-management';
import { MessageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class JmActionHandlerService {
  actionHandlerService = inject(ActionHandlerService);
  messageHandlerService = inject(MessageService);
  handle(action: Action | undefined): void {
    if (action !== undefined) {
      const target = action.actionData.target ?? undefined;
      const creditId = action.actionData.creditId ?? undefined;
      switch (action.actionType) {
        case JourneyManagerActions.REDIRECT:
          if (!target) {
            this.handleError();
          } else {
            this.actionHandlerService.handle({
              type: ActionType.REDIRECT,
              payload: {
                url: target,
              },
            });
          }
          break;
        case JourneyManagerActions.CREDIT_PURCHASE:
          this.actionHandlerService.handle({
            type: ActionType.REDIRECT,
            payload: {
              url: '/stores',
            },
          });
          break;
        case JourneyManagerActions.CREDIT_INSTALLMENT:
        case JourneyManagerActions.CREDIT_REGISTRATION:
          if (!creditId) {
            this.handleError();
          } else {
            this.actionHandlerService.handle({
              type: ActionType.REDIRECT,
              payload: {
                url: `service/credit/go-to-wallet/${creditId}`,
              },
            });
          }
          break;
      }
    }
  }

  handleError(message = 'در حال حاضر انجام این عملیات ممکن نیست'): void {
    this.messageHandlerService.showErrorMessage(message);
  }
}
