import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeColorOpacity } from '@client-monorepo/common/utilities';

@Component({
  selector: 'profile-applet-applet-diamond',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diamond.component.html',
  styleUrl: './diamond.component.scss',
})
export class DiamondComponent implements OnInit {
  @Input() color = '#FFBE00';
  public fillColor!: string;

  ngOnInit(): void {
    this.fillColor = ChangeColorOpacity.addOpacity(this.color, 0.25);
  }
}
