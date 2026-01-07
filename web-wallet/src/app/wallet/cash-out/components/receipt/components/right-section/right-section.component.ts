import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ReceiptService } from '../../services/receipt.service';
import { Subscription, throwError } from 'rxjs';
import { ReceiptInterface } from '../../models/receipt.interface';
import { Router } from '@angular/router';
import {Timer} from "./timer";
import {UserInterfaceModule} from "../../../../../../user-interface/user-interface.module";

@Component({
  selector: 'right-section',
  templateUrl: './right-section.component.html',
  styleUrls: ['./right-section.component.scss'],
  imports: [
    UserInterfaceModule
  ],
  standalone: true
})
export class RightSectionComponent implements OnInit {
  public state: ReceiptInterface;
  public timer = 3;
  private locationStrategy = inject(LocationStrategy);
  private receiptService = inject(ReceiptService);
  private router = inject(Router);

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
    this.navigateToMerchant();
  }

  ngOnInit() {
    history.pushState(null, null, location.href);
    this.state = this.receiptService.getState();
    this.setTimer();
  }

  public setTimer(): void {
    const timerSubscription: Subscription = Timer(this.timer).subscribe(
      (second: number) => {
        this.timer = second;
      }, () => {
        throwError('Error has been occurred!');
      }, () => {
        this.navigateToMerchant();
        timerSubscription.unsubscribe();
      }
    );
  }

  public navigateToMerchant(): void {
    sessionStorage.clear();
    if (this.state?.redirectUrl) {
      window.location.href = this.state.redirectUrl;
      return;
    }
    this.router.navigate(['/']);
  }
}
