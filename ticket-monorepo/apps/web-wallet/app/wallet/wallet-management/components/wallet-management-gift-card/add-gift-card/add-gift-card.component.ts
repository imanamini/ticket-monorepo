import { Component, Inject } from "@angular/core";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { WalletManagementGiftCardApiService } from "../../../../../api/wallet-management-gift-card-api.service";
import { MessageService } from "src/app/core/services/message.service";
import { TokenService } from "../../../services/token.service";
import {BadgeAlertInterface} from "../../../../new-upg/components/badge-alert/badge-alert.interface";

@Component({
  selector: "app-add-gift-card",
  templateUrl: "./add-gift-card.component.html",
  styleUrls: ["./add-gift-card.component.scss"],
})
export class AddGiftCardComponent {
  public voucherCode: number;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetState: BadgeAlertInterface,
    private matBottomSheetRef: MatBottomSheetRef<AddGiftCardComponent>,
    private api: WalletManagementGiftCardApiService,
    private message: MessageService,
    private token: TokenService,
  ) {}



  public onSubmit() {
    if(!this.voucherCode) return;
    this.redeemVouchers(this.voucherCode)
  }

  private redeemVouchers(voucherCode: number){
    this.api.redeemVouchers(voucherCode,this.token.get()).subscribe({
      next:(data)=>{

        this.message.showSuccessMessage(data.message)
        this.handleCloseBottomSheet()
      },
      error:(err)=>{
        this.message.showErrorMessage(err.error?.result?.message)
      }
    })
  }

  public handleCloseBottomSheet(): void {
    this.matBottomSheetRef.dismiss();
  }
}
