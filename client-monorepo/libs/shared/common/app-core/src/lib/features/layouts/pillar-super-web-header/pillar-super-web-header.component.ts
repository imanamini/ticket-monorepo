import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigikalaSuperWebService, IAppEnv, NavigationTabState } from '@client-monorepo/pillar/digikala';

@Component({
  selector: 'dpx-pillar-super-web-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pillar-super-web-header.component.html',
  styleUrl: './pillar-super-web-header.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PillarSuperWebHeaderComponent implements OnInit {
  @HostListener('window:superWebSDKReady')
  onSuperWebSDKReady(): void {
    // TODO: handle super web SDK ready event if needed
  }

  @HostListener('window:superWebNavigationTabState', ['$event'])
  onSuperWebNavigationTabState(event: { detail: NavigationTabState }): void {
    // detect tab state change event
  }
  private digikalaSuperWebService = inject(DigikalaSuperWebService);
  protected isDgkSuperWeb = signal<boolean>(false);
  protected pillarName = signal<string>(this.environment?.digikala?.pillar_name || 'fintech');

  constructor(@Inject('APP_ENV') private readonly environment: IAppEnv) {}

  ngOnInit(): void {
    if (this.digikalaSuperWebService.hasUtmSuperWeb) {
      this.isDgkSuperWeb.set(true);
      this.digikalaSuperWebService.initialize();
    }
  }
}
