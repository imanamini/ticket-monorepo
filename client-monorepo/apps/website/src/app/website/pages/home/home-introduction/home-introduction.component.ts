import { Component, Input } from '@angular/core';
import { HomeMainService } from '../../../../api/clients/models/templates/home/home-data.response';
import { HomeServicesComponent } from '../home-services/home-services.component';

@Component({
  selector: 'app-home-introduction',
  templateUrl: './home-introduction.component.html',
  styleUrls: ['./home-introduction.component.scss'],
  standalone: true,
  imports: [HomeServicesComponent],
})
export class HomeIntroductionComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  services: HomeMainService[] = [];
}
