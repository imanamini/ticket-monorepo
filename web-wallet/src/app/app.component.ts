import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../environments/environment';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2)
  private eventTracker = inject(NgxEventTrackerService);
  constructor()  {
    this.eventTracker.init();
  }

  ngOnInit(): void {
    this.addNoScriptTag();
  }

  private addNoScriptTag(): void {
    if (!environment.google_tag_manager_id) {
      return;
    }

    const noScript = this.renderer.createElement('noscript');
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(iframe, 'src', `https://www.googletagmanager.com/ns.html?id=${environment.google_tag_manager_id}`);
    this.renderer.setAttribute(iframe, 'height', '0');
    this.renderer.setAttribute(iframe, 'width', '0');
    this.renderer.setStyle(iframe, 'display', 'none');
    this.renderer.setStyle(iframe, 'visibility', 'hidden');

    this.renderer.appendChild(noScript, iframe);

    // Add <noscript> tag to the body
    const body = document.getElementsByTagName('body')[0];
    this.renderer.appendChild(body, noScript);
  }
}
