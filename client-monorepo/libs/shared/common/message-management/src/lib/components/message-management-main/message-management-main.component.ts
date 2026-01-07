import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MessageViewEnum } from '../../data-access/models/message-view.enum';
import { MessageManagementPopupComponent } from '../message-management-popup/message-management-popup.component';
import { MessageManagementMessageComponent } from '../message-management-message/message-management-message.component';
import { Message } from '../../data-access/models/messages-response';

@Component({
  selector: 'common-message-management-main',
  standalone: true,
  imports: [MessageManagementPopupComponent, MessageManagementMessageComponent],
  templateUrl: './message-management-main.component.html',
  styleUrl: './message-management-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageManagementMainComponent {
  viewMode = input<MessageViewEnum>(MessageViewEnum.MESSAGE);
  message = input<Message | null>(null);

  protected readonly MessageViewEnum = MessageViewEnum;
}
