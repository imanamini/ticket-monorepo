import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dynamic-landings',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent],
  templateUrl: './dynamic-landings.component.html',
  styleUrl: './dynamic-landings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicLandingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('frame', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;
  iframeUrl!: SafeResourceUrl;
  private wheelListener!: (e: WheelEvent) => void;

  private messageHandler = this.onParentMessage.bind(this);

  protected iframeStyles = {
    width: '100%',
    border: 'none',
    height: '100vh',
  };

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit() {
    // whenever the slug param changes…
    this.route.paramMap.subscribe((params: ParamMap) => {
      const slug = params.get('slug');
      if (slug === 'merchant-acquisition' && isPlatformBrowser(this.platformId)) {
        window.location.href = '/assets/html/merchant-acquisition/index.html';
      } else {
        if( 'b2o-summer-04-campaign' === slug) {
          this.iframeStyles = {
            width: '100%',
            border: 'none',
            height: this.isDesktop() ? 'calc(100vh + 500px)' : 'calc(100vh + 100px)',
          };
        }
        const url = `assets/html/${slug}/index.html`;
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    });
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('message', this.messageHandler, false);
    }
  }

  isDesktop(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth > 1280;
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.wheelListener = this.onIframeWheel.bind(this);
      this.iframeRef.nativeElement.addEventListener('wheel', this.wheelListener, { passive: false });
    });
  }

  private onIframeWheel(event: WheelEvent) {
    const iframeEl = this.iframeRef.nativeElement;
    const win = iframeEl.contentWindow;
    if (!win) {
      return;
    }
    const doc = win.document.documentElement;
    const scrollTop = doc.scrollTop;
    const scrollHeight = doc.scrollHeight;
    const clientHeight = doc.clientHeight;

    const atTop = scrollTop === 0 && event.deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight && event.deltaY > 0;

    if (atTop || atBottom) {
      return;
    } else {
      event.stopPropagation();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('message', this.messageHandler, false);
    }
  }

  onIframeLoad() {
    this.ngZone.runOutsideAngular(() => {
      try {
        const iframe = this.iframeRef.nativeElement;
        const win = iframe.contentWindow!;
        const doc = win.document;

        const script = doc.createElement('script');
        script.type = 'text/javascript';
        script.text = `
          (function(){
            const el = document.scrollingElement || document.documentElement;
            window.addEventListener('wheel', function(e) {
              const scrollTop = el.scrollTop;
              const maxScroll = el.scrollHeight - el.clientHeight;
              const delta = e.deltaY;

              // only if the child page actually _can_ scroll
              if (maxScroll > 0) {
                const atTop    = scrollTop <= 0        && delta < 0;
                const atBottom = scrollTop >= maxScroll && delta > 0;

                if (atTop || atBottom) {
                  // chain to the parent:
                  parent.postMessage({ type:'CHAINED_SCROLL', delta }, '*');
                  e.preventDefault();
                }
                // otherwise, let the iframe scroll normally
              }
              // if maxScroll <= 0, there's nothing to scroll inside—
              // do nothing, letting the wheel naturally bubble to parent
            }, { passive: false });
          })();
        `;
        doc.head.appendChild(script);
      } catch (err) {
        console.warn('Iframe injection failed:', err);
      }
    });
  }

  private onParentMessage(event: MessageEvent) {
    const iframeWin = this.iframeRef.nativeElement.contentWindow;
    if (event.source === iframeWin && event.data?.type === 'CHAINED_SCROLL') {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollBy({ top: event.data.delta, behavior: 'auto' });
      }
    }
  }
}
