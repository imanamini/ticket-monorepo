import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {joinFlowSection} from "../../../../../api/clients/models/templates/careers/careers-template-date";
import {CustomGalleryComponent} from "../../../../../ui/ui-components/ui-custom-gallery/custom-gallery.component";

@Component({
  selector: 'app-join-flow',
  standalone: true,
  imports: [CommonModule, CustomGalleryComponent],
  templateUrl: './join-flow.component.html',
  styleUrl: './join-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinFlowComponent {

  joinFlow = input<joinFlowSection>();
}
