import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-plugin-applet-plugin-success',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxButtonComponent],
  templateUrl: './plugin-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginSuccessComponent {}
