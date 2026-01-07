import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stores-applet-map-empty-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-empty-result.component.html',
  styleUrl: './map-empty-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEmptyResultComponent {}
