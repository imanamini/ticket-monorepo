import { Component, Input } from '@angular/core';
import { ContentSection } from '../merchant-register-response';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  standalone: true,
  imports: [NgForOf],
  styleUrls: ['./content-section.component.scss'],
})
export class ContentSectionComponent {
  @Input()
  contentSection!: ContentSection[];
}
