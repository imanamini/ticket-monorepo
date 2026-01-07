import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerHomeComponent } from '../../components/buyer/buyer-home/buyer-home.component';
import { SellerHomeComponent } from '../../components/seller/seller-home/seller-home.component';
import { SwitchRoleComponent } from '@client-monorepo/shared/escrow/merchant-existence';
import { StorageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'escrow-home-applet-home',
  standalone: true,
  imports: [CommonModule, BuyerHomeComponent, SellerHomeComponent, SwitchRoleComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  storageService = inject(StorageService);
  isSeller = signal<boolean>(false);

  handleRoleChange(role: string) {
    this.isSeller.set(role === 'seller');
  }
}
