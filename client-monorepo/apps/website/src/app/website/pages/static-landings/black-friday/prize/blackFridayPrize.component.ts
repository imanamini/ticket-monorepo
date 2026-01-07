import {ChangeDetectionStrategy, Component, Inject, input, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {ApiFile} from "../../../../../api/clients/models/common/api-file";
import {platformBrowser} from "@angular/platform-browser";

@Component({
  selector: 'app-black-friday-prize',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blackFridayPrize.component.html',
  styleUrl: './blackFridayPrize.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayPrizeComponent implements OnInit {
  prize = input<{
    title: string,
    subtitle: string | null,
    desktopImage: ApiFile | null,
    mobileImage: ApiFile | null,
  }>();

  constructor(@Inject(PLATFORM_ID) public platformID: string,) {
  }

  mobileMode = signal<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformID)) {
      this.mobileMode.set(window.innerWidth <= 1280);
    }
  }
}
