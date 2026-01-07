import {ChangeDetectionStrategy, Component, input, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiFile} from "../../../../../api/clients/models/common/api-file";
import {NgxIcon} from "@digipay/ngx-icon";

@Component({
  selector: 'app-about-us-history-item',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './about-us-history-item.component.html',
  styleUrl: './about-us-history-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsHistoryItemComponent {

  historyItem = input<{
    image: ApiFile;
    title: string;
    description: string;
    subtitle?: string;
  }>(null);

  isActive = input<boolean>(false);
}
