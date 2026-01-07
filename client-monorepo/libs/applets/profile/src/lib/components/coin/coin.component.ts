import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeColorOpacity } from '@client-monorepo/common/utilities';

@Component({
  selector: 'profile-applet-coin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coin.component.html',
})
export class CoinComponent implements OnInit {
  @Input() color = '#FFBE00';
  public bgColor!: string;
  public fillColor!: string;

  ngOnInit(): void {
    this.bgColor = ChangeColorOpacity.addOpacity(this.color, 0.05);
    this.fillColor = ChangeColorOpacity.addOpacity(this.color, 0.25);
  }
}
