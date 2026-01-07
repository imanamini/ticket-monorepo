import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  computed,
  DoCheck,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router, RouterOutlet } from '@angular/router';
import { NgxBottomNavigationService, NgxBottomNavigationWrapperComponent } from '@digipay/ngx-bottom-navigation';
import { EmitterService, EmittingDataEnum, StorageService } from '@client-monorepo/common/utilities';
import { Subscription } from 'rxjs';
import { AuthService, UserApiService } from '@client-monorepo/common/user';
import { ErrorPageComponent } from '@client-monorepo/common/network';
import { RouterAnimation } from '@client-monorepo/common/animations';
import { NgxBottomSheetComponent } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'escrow-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxBottomNavigationWrapperComponent, ErrorPageComponent, NgxBottomSheetComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: RouterAnimation,
})
export class MainComponent implements OnInit, DoCheck, AfterViewChecked, OnDestroy {
  storageService = inject(StorageService);
  authService = inject(AuthService);
  @ViewChild('navigationArea', { static: false }) navigationArea!: ElementRef;
  layoutBody = viewChild<ElementRef>('layoutBody');
  emitted = false;
  expanded = signal<boolean>(true);
  hasScrolled = signal<boolean>(true);
  initialHeight = 0;
  bottomNavigationService = inject(NgxBottomNavigationService);
  timeOUt!: any;
  routerSubscription!: Subscription;
  activatedRoute = inject(ActivatedRoute);
  userApiService = inject(UserApiService);
  containerStyle = computed(() => {
    const padding = this.hasScrolled() ? this.bottomNavigationService.reservedHeight() : 0;
    return {
      paddingBottom: `${padding}px`,
    };
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private router: Router,
    private emitterService: EmitterService,
  ) {}

  ngOnInit() {
    this.checkRedirectTo();
    this.initComponent();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  initComponent(): void {
    const element = this.elementRef?.nativeElement?.ownerDocument.body;
    this.initialHeight = element.clientHeight;
    this.routerSubscription = this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          if (this.timeOUt) {
            clearTimeout(this.timeOUt);
          }
          this.timeOUt = setTimeout(() => {
            this.layoutBody().nativeElement.scrollTop = 0;
            this.checkScroll();
          }, 1);
        }
      },
    });
  }

  ngAfterViewChecked() {
    this.checkScroll();
  }

  ngDoCheck() {
    // this.cdr.detectChanges();
    this.checkScroll();
  }

  checkScroll(): void {
    const element = this.elementRef?.nativeElement?.querySelector('#main-layout-body-container');
    this.hasScrolled.set(element.scrollHeight > this.initialHeight);
  }

  handleScroll(event: any): void {
    if (this.layoutBody()?.nativeElement === event.currentTarget) {
      const pos = (this.layoutBody()?.nativeElement.scrollTop || document.body.scrollTop) + this.layoutBody()?.nativeElement.offsetHeight;
      const max = this.layoutBody()?.nativeElement.scrollHeight;
      if (pos >= max - 50) {
        if (!this.emitted) {
          this.emitterService.emitEvent(EmittingDataEnum.MAIN_LAYOUT_SCROLLED_TO_END);
          this.emitted = true;
          this.checkScroll();
        }
      } else {
        this.emitted = false;
      }
    }
  }

  checkRedirectTo() {
    this.activatedRoute.queryParams.subscribe((param) => {
      // rt means redirect to
      if (param.rt) {
        const currentUrl = window.location.href;

        // Create a URL object to parse the URL
        const url = new URL(currentUrl);

        // Get the route and query parameters from the URL
        const queryParams = url.searchParams.toString();

        // Split the route and query parameters
        const [route, queryParamsString] = decodeURIComponent(queryParams).split('?');

        // Create NavigationExtras object
        const navigationExtras: NavigationExtras = {
          queryParams: queryParamsString
            ? JSON.parse('{"' + queryParamsString.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) =>
                key === '' ? value : decodeURIComponent(value),
              )
            : {},
        };

        // Use Router to navigate to the specified route with query parameters
        this.router.navigate([route.replace(/rt=/, '')], navigationExtras);
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
