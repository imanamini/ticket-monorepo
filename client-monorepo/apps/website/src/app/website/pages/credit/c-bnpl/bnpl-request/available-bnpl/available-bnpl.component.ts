import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { WebViewService } from '../../../../../../core/services/web-view.service';
import { NgIf } from '@angular/common';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-available-bnpl',
  templateUrl: './available-bnpl.component.html',
  styleUrls: ['./available-bnpl.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, NgIf, UiIconDirective],
})
export class AvailableBnplComponent implements OnInit, OnDestroy {
  counter = 8;

  counterIntervalRef: ReturnType<typeof setTimeout>;

  @Output()
  navigateCBnplClicked: EventEmitter<any> = new EventEmitter();

  isWebView = false;

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    private webViewService: WebViewService,
  ) {}

  ngOnInit(): void {
    this.isWebView = this.webViewService.isWebView();
    this.counterIntervalRef = setInterval(() => {
      this.counter--;
      if (this.counter === 0) {
        this.checkoutBnpl();
        clearInterval(this.counterIntervalRef);
      }
    }, 1000);
  }

  checkoutBnpl() {
    if (this.isWebView) {
      this.webViewService.close();
      return;
    }
    if (this.platformId !== 'server') {
      window.location.href = 'https://click.adtrace.io/jvxjuf6';
    }
  }

  goToCBnpl() {
    this.navigateCBnplClicked.emit();
  }

  ngOnDestroy(): void {
    clearTimeout(this.counterIntervalRef);
  }
}
