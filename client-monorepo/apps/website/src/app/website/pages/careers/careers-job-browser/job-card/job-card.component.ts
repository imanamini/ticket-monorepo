import { Component, Input } from '@angular/core';
import { JobPostItem } from '../../../../../api/clients/models/hr/job-post-item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class JobCardComponent {
  @Input()
  jobPost: JobPostItem;
}
