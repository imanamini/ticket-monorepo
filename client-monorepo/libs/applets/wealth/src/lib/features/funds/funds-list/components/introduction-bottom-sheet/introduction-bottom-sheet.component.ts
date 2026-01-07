import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IIntroductionData } from '../../models/introduction.interface';

@Component({
  selector: 'app-introduction-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './introduction-bottom-sheet.component.html',
  styleUrl: './introduction-bottom-sheet.component.scss',
})
export class IntroductionBottomSheetComponent implements OnInit {
  private bottomSheet = inject(NgxBottomSheetService);
  data = signal<IIntroductionData | undefined>(undefined);

  ngOnInit() {
    this.data.set(this.bottomSheet.data().data);
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }
}
