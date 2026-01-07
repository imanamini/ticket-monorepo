import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { BaseApiService } from '../../../data-access/services/base-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditEnoteResult } from '../models/credit-enote-result';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-enote-step-result',
  templateUrl: './credit-enote-step-result.component.html',
  styleUrls: ['./credit-enote-step-result.component.scss'],
  standalone: true,
  imports: [
    PdfViewerModule,
    NgxButtonComponent,
    NgxSpinnerModule,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepResultComponent implements OnInit {
  data = input<CreditEnoteResult>();
  back = output<void>();
  finish = output<void>();
  fileData = signal<Uint8Array | undefined>(undefined);
  apiService = inject(BaseApiService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.getEnoteImage();
  }

  onBack(): void {
    this.back.emit();
  }

  onSubmit(): void {
    this.finish.emit();
  }

  private getEnoteImage() {
    this.apiService.getCreditImage(this.data()?.imageId!).subscribe({
      next: (res) => {
        res.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
          const unit8Array = new Uint8Array(arrayBuffer);
          this.fileData.set(unit8Array);
        });
      },
      error: (e) => {
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }
}
