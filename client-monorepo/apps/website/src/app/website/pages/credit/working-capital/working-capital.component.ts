import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageClient } from '../../../../api/clients/page-client';
import { Page } from '../../../../api/clients/models/content/page';
import { WorkingCapitalTemplateData } from '../../../../api/clients/models/templates/working-capital/working-capital-template-data';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { WorkingCapitalOnboardingComponent } from './components/working-capital-onboarding/working-capital-onboarding.component';
import { ActivatedRoute } from '@angular/router';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { WorkingCapitalRequestFormComponent } from './components/working-capital-request-form/working-capital-request-form.component';
import { WorkingCapitalBenefitsComponent } from './components/working-capital-benefits/working-capital-benefits.component';
import { WorkingCapitalWrapperComponent } from './components/working-capital-wrapper/working-capital-wrapper.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-working-capital',
  templateUrl: './working-capital.component.html',
  styleUrls: ['./working-capital.component.scss'],
  standalone: true,
  imports: [NgIf, BaseLayoutComponent, WorkingCapitalWrapperComponent, WorkingCapitalBenefitsComponent, WorkingCapitalRequestFormComponent],
})
export class WorkingCapitalComponent implements OnInit {
  workingCapitalPage!: Page<WorkingCapitalTemplateData>;

  loaded = false;

  contactForm!: ContactForm;

  errorType: string;

  constructor(
    private pageClient: PageClient,
    private dialog: DialogBottomSheetService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'working-capital').subscribe((res) => {
      this.workingCapitalPage = res.page;
      this.contactForm = res.contactForms[0];
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });

    if (isPlatformBrowser(this.platformId)) {
      const chat = document.createElement('script');
      chat.src = '/assets/scripts/working-capital-goftino.js';
      document.body.appendChild(chat);
    }
  }

  // Deprecated method, it might be used in the future again
  openOnboardingDialog() {
    this.dialog
      .open(WorkingCapitalOnboardingComponent, {
        width: 430,
        fullHeightBottomSheet: true,
        data: {
          onboarding: this.workingCapitalPage.templateData.onboarding,
        },
      })
      .then();
  }

  setErrorType(errorType: string) {
    this.errorType = errorType;
  }
}
