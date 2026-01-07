import {
  Component,
  effect,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass } from '@angular/common';
import { VoucherRemoveComponent } from './partials/voucher-remove/voucher-remove.component';
import { Router } from '@angular/router';
import { DiscountModel } from '../../../data-access/models/application-form/discount.model';
import { BaseComponent } from '../../../../../components/base/base.component';
import { PurchaseTicketTypeEnum } from '../../../data-access/enums/purchase-ticket-type.enum';
import { BottomSheetService } from '../../../../../data-access/services/bottom-sheet.service';
import { VoucherApiService } from '../../../data-access/services/third-party/voucher-api.service';
import { StoreService } from '../../../features/third-party/data-access/services/store.service';
import { IconEnum } from '../../../../../data-access/enums/icon.enum';
import { BottomSheetBoxComponent } from '../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { VoucherInputComponent } from './partials/voucher-input/voucher-input.component';
import { MotorStoreService } from '../../../features/third-party-motor/data-access/services/motor-store.service';
import {
  MotorApplicationFormApiService
} from '../../../data-access/services/third-party-motor/motor-application-form-api.service';

@Component({
  selector: 'voucher',
  standalone: true,
  imports: [
    PipesModule,
    NgxIcon,
    NgClass
  ],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss'
})
export class VoucherComponent extends BaseComponent implements OnInit {
  voucherChange = output<boolean>();
  voucher = input<DiscountModel>();
  productType = input.required<'car' | 'motor'>();
  ticketType = input.required<PurchaseTicketTypeEnum>();

  private bottomSheetService = inject(BottomSheetService);
  private voucherApiService: VoucherApiService | MotorApplicationFormApiService;
  private storeService: StoreService | MotorStoreService;
  private router = inject(Router);

  private readonly carStoreService = inject(StoreService);
  private readonly motorStoreService = inject(MotorStoreService);
  private readonly carApplicationService = inject(VoucherApiService);
  private readonly motorApplicationService = inject(MotorApplicationFormApiService);
  @ViewChild('vc', {read: ViewContainerRef})
  public readonly vcRef!: ViewContainerRef;

  protected readonly IconEnum = IconEnum;

  constructor() {
    super();
    effect(() => {
      if (this.productType()) {
        switch (this.productType()) {
          case 'car':
            this.voucherApiService = this.carApplicationService;
            this.storeService = this.carStoreService;
            break;
          case 'motor':
            this.voucherApiService = this.motorApplicationService;
            this.storeService = this.motorStoreService;
            break;
        }
      }
    });
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.handleClicked();
  }

  ngOnInit(): void {
    this.checkForVoucherFragment();
  }

  private checkForVoucherFragment(): void {
    const fragment = this.activatedRoute.snapshot.fragment;
    if (fragment === 'voucherOpen') {
      this.openVoucherBottomSheet();
    }

    super.addSubscription(
      this.activatedRoute.fragment.subscribe(fragment => {
        if (fragment === 'voucherOpen') {
          this.openVoucherBottomSheet();
        }
      })
    );
  }

  handleClicked(): void {
    this.router.navigate([], {
      fragment: 'voucherOpen',
      queryParamsHandling: 'merge'
    });
  }

  private openVoucherBottomSheet(): void {
    if (!this.voucher()?.code) {
      const bottomSheet = this.bottomSheetService.open(BottomSheetBoxComponent, {
        name: 'VoucherInputBottomSheet',
        component: VoucherInputComponent,
        title: 'کد تخفیف',
        data: {
          ticketType: this.ticketType(),
          productType: this.productType()
        },
      }, {
        viewContainer: this.vcRef
      });

      bottomSheet.afterDismissed().subscribe({
        next: res => {
          this.router.navigate([], {
            fragment: null,
            queryParamsHandling: 'merge'
          });
          if (res) {
            this.voucherChange.emit(true);
          }
        }
      });
    } else {
      super.addSubscription(
        this.bottomSheetService.open(BottomSheetBoxComponent, {
          name: 'VoucherBottomSheet',
          component: VoucherRemoveComponent
        }, {
          showHolderIcon: true,
          closeOnNavigation: false,
        }).afterDismissed()
          .subscribe({
            next: (data: string) => {
              this.router.navigate([], {
                fragment: null,
                queryParamsHandling: 'merge'
              });
              if (data) {
                if (!data) {
                  return;
                }

                this.voucherApiService.removeVoucher(this.storeService.getFormId()).subscribe({
                  next: response => {
                    if (response.success) {
                      this.voucherChange.emit(true);
                    }
                  }
                });
              }
            }
          }));
    }
  }
}
