import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PluginActivationOptions } from '../../data-access/models/plugin.interface';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'escrow-plugin-applet-plugin-activation',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxRadioButtonComponent, NgxButtonComponent],
  templateUrl: './plugin-activation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginActivationComponent implements OnInit, OnDestroy {
  messageService = inject(MessageService);
  storageService = inject(EscrowStorageService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  pluginActivationOptions = signal<PluginActivationOptions[]>([
    { id: 1, name: 'فقط برای یک آگهی', img: 'assets/images/divar.png' },
    { id: 2, name: 'فعال سازی برای تمامی آگهی‌های من', img: 'assets/images/dp.png' },
  ]);
  selectedOption = signal<PluginActivationOptions>({} as PluginActivationOptions);
  isLoading = signal<boolean>(false);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.initializeData();
  }

  private initializeData(): void {
    const params = this.route.snapshot.queryParams;
    const platform = params['platform'];
    const postToken = params['post_token'];
    const returnUrl = params['return_url'];

    if (platform === 'divar' && postToken && returnUrl) {
      this.storageService.setEscrowPluginActivationReturnUrl(returnUrl);
      this.storageService.setEscrowPluginActivationPostToken(postToken);
    } else {
      this.messageService.showErrorMessage('خطا');
    }
  }

  handleCheckChange(id: number, isChecked: boolean): void {
    const filter = this.pluginActivationOptions().find((option) => option.id === id);
    if (filter && isChecked) {
      this.selectedOption.set(filter);
    }
  }

  activePlugin() {
    this.isLoading.set(true);

    const returnUrl = this.storageService.getEscrowPluginActivationReturnUrl();
    const postToken = this.storageService.getEscrowPluginActivationPostToken();

    const url =
      this.selectedOption().id === 1
        ? `digipay/api/escrow-channel/announcements/divar/init?post_token=${postToken}&return_url=${returnUrl}`
        : `digipay/api/escrow-channel/announcements/divar/init-all?post_token=${postToken}&return_url=${returnUrl}`;
    window.location.replace(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
