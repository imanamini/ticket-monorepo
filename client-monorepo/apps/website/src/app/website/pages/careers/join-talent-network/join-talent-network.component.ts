import { Component, OnInit } from '@angular/core';
import { FormFieldOption } from '../../../../ui/ui-components/form-field-builder/models/form-field-option.interface';
import { CareersService } from '../careers.service';
import { ApplicationReceivedResponse } from '../../../../api/clients/models/hr/application-received.response';
import { FormNoticeComponent } from '../../../../ui/ui-components/ui-form/form-notice/text-field-notice.component';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { NgClass, NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-join-talent-network',
  templateUrl: './join-talent-network.component.html',
  styleUrls: ['./join-talent-network.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, ApplicationFormComponent, FormNoticeComponent],
})
export class JoinTalentNetworkComponent implements OnInit {
  isVisible = false;

  departments: FormFieldOption[] = [];

  successMessage = '';

  clearSignal = 0;

  constructor(private service: CareersService) {}

  ngOnInit(): void {
    this.service.jobCategories.asObservable().subscribe((categories) => {
      this.departments = categories.map((c) => {
        return {
          title: c.categoryName,
          value: c.categoryName,
        };
      });
    });
  }

  toggleFormVisibility() {
    this.isVisible = !this.isVisible;
    this.successMessage = '';
  }

  onSuccessfulApply(event: ApplicationReceivedResponse): void {
    this.successMessage = event.message;
    this.clearSignal += 1;

    of('')
      .pipe(delay(10000))
      .subscribe({
        next: () => {
          this.successMessage = '';
        },
      });
  }
}
