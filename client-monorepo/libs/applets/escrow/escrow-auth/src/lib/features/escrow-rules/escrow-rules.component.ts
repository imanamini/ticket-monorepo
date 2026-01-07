import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-auth-applet-escrow-rules',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxButtonComponent],
  templateUrl: './escrow-rules.component.html',
  styleUrl: './escrow-rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscrowRulesComponent {
  content = signal('');
  route = inject(Router);

  handelHeaderAction() {
    this.route.navigate(['/login']);
  }
}
