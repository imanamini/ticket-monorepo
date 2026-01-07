import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiFile} from "../../../../../api/clients/models/common/api-file";
import {NgxIcon} from "@digipay/ngx-icon";

@Component({
  selector: 'app-tapsi-step-item',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './tapsi-step-item.component.html',
  styleUrl: './tapsi-step-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsiStepItemComponent {
  historyItem = input<{
    desktopImage: ApiFile;
    mobileImage: ApiFile;
    title: string;
    description: string;
    subtitle?: string;
  }>(null);

  isActive = input<boolean>(false);
  number = input<number>(1);
}
