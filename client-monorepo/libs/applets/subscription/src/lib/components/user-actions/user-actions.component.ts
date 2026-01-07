import { Component, Input } from '@angular/core';
import { SectionTitleComponent } from '../section-title/section-title.component';
import { PlanServices, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'subscription-applet-user-actions',
  standalone: true,
  imports: [SectionTitleComponent],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.scss',
})
export class UserActionsComponent {
  @Input() services!: PlanServices[];

  constructor(private router: Router) {}

  onNextActionClicked(url: string) {
    this.router.navigateByUrl(url).then();
  }

  protected readonly SERVICES_TYPE = SERVICES_TYPE;
}
