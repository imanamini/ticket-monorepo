import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable} from "rxjs";
import {LoadingService, SpinnerState} from "../../../marketing-campaigns/third-party-insurance/loading.service";
import {NgxButtonComponent} from "@digipay/ngx-button";

@Component({
  selector: 'app-waiting-spinner',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './waiting-spinner.component.html',
  styleUrl: './waiting-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingSpinnerComponent implements OnInit {
  @Input() state: 'success' | 'error' = 'success';

  spinnerState$: Observable<SpinnerState>;

  constructor(private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.spinnerState$ = this.loadingService.spinnerState$;
  }

  closeSpinner() {
    this.loadingService.hide();
  }
}
