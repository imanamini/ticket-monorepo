import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { ErrorService } from '../../../components/core/services/error.service';
import { ResponseError } from '../../../data-access/models/response-error.model';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-off-time-error',
  standalone: true,
  imports: [NgxAppBarComponent, NgxButtonComponent],
  templateUrl: './off-time-error.component.html',
  styleUrl: './off-time-error.component.scss',
})
export class OffTimeErrorComponent implements OnInit {
  error!: ResponseError | null;
  private location = inject(Location);
  private errorService = inject(ErrorService);

  ngOnInit(): void {
    this.error = this.errorService.getParams();
  }

  onBackHandler() {
    this.errorService.clearParams();
    this.location.back();
  }
}
