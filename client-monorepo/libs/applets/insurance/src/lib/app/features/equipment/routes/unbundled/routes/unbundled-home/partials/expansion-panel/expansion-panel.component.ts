import { Component, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

interface ExpansionData {
  id: number;
  title: string;
  description: DescriptionDataModel[];
  descriptionHeight: number;
}

interface DescriptionDataModel {
  text: string;
  hasBullet: boolean;
}

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  imports: [
    NgForOf
  ],
  standalone: true
})
export class ExpansionPanelComponent implements OnInit {

  @Input() expansionData: ExpansionData[];

  selectedId = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  expansionClick(selectedId): void {
    this.selectedId = this.selectedId === selectedId ? 0 : selectedId;
  }
}
