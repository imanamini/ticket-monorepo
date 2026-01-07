import { Component } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { IplHeaderComponent } from '../../../ipl-steps/ipl-header/ipl-header.component';

@Component({
  selector: 'app-cut-off',
  standalone: true,
  imports: [
    NgxStatusResultModule,
    IplHeaderComponent,
  ],
  templateUrl: './cut-off.component.html',
  styleUrl: './cut-off.component.scss'
})
export class CutOffComponent {

}
