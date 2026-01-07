import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MerchantExistenceService } from '@client-monorepo/shared/escrow/merchant-existence';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-merchant-existence-switch-role',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './switch-role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchRoleComponent implements OnInit {
  merchantExistenceService = inject(MerchantExistenceService);
  router = inject(Router);
  storageService = inject(EscrowStorageService);
  roleChanged = output<string>();
  role = signal<'seller' | 'buyer'>(this.getStoredRole());
  merchantExists = signal<boolean>(false);
  constructor(@Inject('merchantRegistrationUrl') private merchantRegistrationUrl: string) {}

  ngOnInit() {
    this.getUserRole();
  }

  private getStoredRole(): 'seller' | 'buyer' {
    const stored = this.storageService.getEscrowLastUserRole();
    return stored === 'seller' || stored === 'buyer' ? stored : 'buyer';
  }

  private getUserRole() {
    this.merchantExistenceService.getUserRole().subscribe({
      next: (res) => {
        this.merchantExists.set(res.merchantExists);
        if (res.merchantExists) {
          const storedRole = this.getStoredRole();
          this.role.set(storedRole);
          this.storageService.setEscrowLastUserRole(storedRole);
        } else {
          this.role.set('buyer');
          this.storageService.setEscrowLastUserRole('buyer');
        }
        this.emitRole();
      },
      error: () => {
        this.role.set('buyer');
        this.emitRole();
      },
    });
  }

  switchPanel(): void {
    if (this.merchantExists()) {
      const newRole: 'seller' | 'buyer' = this.role() === 'seller' ? 'buyer' : 'seller';
      this.role.set(newRole);
      this.storageService.setEscrowLastUserRole(newRole);
      this.emitRole();
    } else {
      window.location.href = this.merchantRegistrationUrl;
    }
  }

  private emitRole(): void {
    this.roleChanged.emit(this.role());
  }
}
