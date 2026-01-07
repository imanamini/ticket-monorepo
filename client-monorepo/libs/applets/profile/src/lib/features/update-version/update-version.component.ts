import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { VersionApiService, VersioningService, VersionResponse, WebVersion } from '@client-monorepo/versioning';
import { UPDATE_VERSION_CONFIG } from '../../data-access/constants/update-version-content.const';
import { ChangeAbPartitionComponent } from '../../components/change-ab-partition/change-ab-partition.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { NativeVersionToastComponent } from '@client-monorepo/versioning';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'profile-applet-update-version',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    PageLayoutComponent,
    NgxButtonComponent,
    NativeVersionToastComponent,
    LottieComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './update-version.component.html',
  styleUrl: './update-version.component.scss',
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateVersionComponent implements OnInit, OnDestroy {
  private versioning = inject(VersioningService);
  untilDestroy = inject(DestroyRef);
  private ngxHybridService = inject(NgxHybridService);
  private versionApiService = inject(VersionApiService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private bottomSheetService = inject(NgxBottomSheetService);
  webVersion = signal<WebVersion>({} as WebVersion);
  hasHybridVersion = signal(false);
  storeUrl = signal('');
  versionState = signal<'HAS_NEW_VERSION' | 'LATEST_VERSION' | 'ERROR' | 'CHECKING'>('CHECKING');
  developerModeLoading = signal(false);
  isLoading = signal(true);
  clickCount = 0;
  clickTimer: any;
  content = computed(() => {
    return UPDATE_VERSION_CONFIG[this.versionState()];
  });
  reloading = signal(false);
  checkingUpdateAnimation = signal('/assets/update/checking-update.json');
  imagePath = computed(() => {
    const state = this.versionState();
    switch (state) {
      case 'HAS_NEW_VERSION':
        return 'assets/update/new-update-available.svg';
      case 'LATEST_VERSION':
        return 'assets/update/is-update.svg';
      default:
        return '';
    }
  });
  newVersionMode = computed(() => {
    return (
      this.versionState() === 'HAS_NEW_VERSION' &&
      this.webVersion().newVersion &&
      this.webVersion().newVersion !== this.webVersion().currentVersion
    );
  });

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    this.checkVersion();
    this.getWebVersion();
    this.checkHasHybridVersion();
  }
  private checkVersion(): void {
    this.versioning
      .hasNewVersion()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: (foundNewVersion) => {
          this.versionState.set(foundNewVersion ? 'HAS_NEW_VERSION' : 'LATEST_VERSION');
        },
        error: () => {
          this.versionState.set('ERROR');
          this.isLoading.set(false);
        },
      });
  }
  private getWebVersion(): void {
    this.versioning
      .getWebVersion()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: (result: WebVersion | null) => {
          this.webVersion.set({
            currentVersion: result?.currentVersion ?? '1.0.0',
            newVersion: result?.newVersion ?? '',
          });
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  private checkHasHybridVersion(): void {
    if (!this.ngxHybridService.isAndroidHybrid()) return;
    this.versionApiService.getNativeVersionApi().subscribe({
      next: (result: VersionResponse) => {
        if (!result.latest) {
          this.hasHybridVersion.set(true);
          this.storeUrl.set(result?.storeUrl);
        }
      },
    });
  }

  onUpdateNativeClicked(): void {
    if (this.storeUrl()) {
      window.open(this.storeUrl(), '_blank');
    }
  }

  updateVersion(): void {
    this.reloading.set(true);
    this.versioning.reloadPage();
  }

  onClickImage(): void {
    if (this.developerModeLoading()) {
      return;
    }
    this.clickCount++;
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => {
      this.clickCount = 0;
    }, 4000);
    if (this.clickCount >= 10) {
      this.clickCount = 0;
      this.developerMode();
    }
  }

  developerMode() {
    this.developerModeLoading.set(true);
    setTimeout(() => {
      this.developerModeLoading.set(false);
      this.bottomSheetService.openBottomSheet(ChangeAbPartitionComponent, {});
    }, 1500);
  }
  ngOnDestroy() {
    this.bottomNavigationService.show();
  }
}
