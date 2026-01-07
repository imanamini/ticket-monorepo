import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit {
  title = 'merchant-credit';
  @ViewChild('scriptWrapper') scriptWrapper?: ElementRef<HTMLDivElement>;

  private eventTracker = inject(NgxEventTrackerService);

  ngOnInit(): void {
    this.eventTracker.init();
  }

  ngAfterViewInit(): void {
    this.addGoftinoChatToThePage();
    // this.eventTracker.initIntrackOnSiteMessaging();
    // this.eventTracker.initIntrackWebPush();
  }

  private addGoftinoChatToThePage() {
    const script = document.createElement('script');
    script.src = './assets/lib/goftino.js';
    if (this.scriptWrapper && this.scriptWrapper.nativeElement) {
      this.scriptWrapper.nativeElement.appendChild(script);
    }
  }
}
