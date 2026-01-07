import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-risk-bar',
  standalone: true,
  templateUrl: './risk-bar.component.html',
  styleUrl: './risk-bar.component.scss',
  imports: [NgClass],
})
export class RiskBarComponent {
  riskLevel = input.required<string>();
  risk = computed(() => this.riskLevel()?.toLowerCase());
}
