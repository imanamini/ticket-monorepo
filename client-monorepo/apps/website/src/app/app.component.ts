import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'website';

  constructor(
    @Inject('APP_ENV') private environment: { [key: string]: string },
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setClarityProperty('ang', '17');
    }
  }

  private setClarityProperty(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('set', key, value);
      } else {
        console.warn('ℹ️ Clarity not available yet.');
      }
    } catch (err) {
      console.error('❌ Failed to set Clarity property:', err);
    }
  }
}
