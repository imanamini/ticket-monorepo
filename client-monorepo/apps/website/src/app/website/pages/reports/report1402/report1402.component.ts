import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../services/page-data.service';
import { ReportIntroComponent } from './report-intro/report-intro.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-report1402',
  templateUrl: './report1402.component.html',
  styleUrls: ['./report1402.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, ReportIntroComponent],
})
export class Report1402Component implements OnInit {
  loaded = false;

  constructor(private pageDataService: PageDataService) {}

  ngOnInit(): void {
    this.pageDataService.getPageData('p', 'report-1402').subscribe(() => {
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }
}
