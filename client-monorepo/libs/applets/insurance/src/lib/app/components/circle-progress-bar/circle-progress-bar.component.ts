import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'circle-progress-bar',
  templateUrl: './circle-progress-bar.component.html',
  styleUrls: ['./circle-progress-bar.component.scss'],
  standalone: true,
  imports: [NgStyle]
})
export class CircleProgressBarComponent implements OnChanges {

  @Input()
  circleRadius = 20;

  @Input()
  canvasSize = 64;

  @Input()
  canvasBorderRadius = 8;

  @Input()
  labelFontSize = 12;

  @Input()
  percent = 0;

  @Input()
  labelColor = 'black';

  @Input()
  backGroundColor = '#f2f5f8';

  @Input()
  progressColor = '#3c6dff';

  resultPlaceHolder = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.percent <= 100) {
      this.arcMove();
    } else {
      this.percent = 100;
    }
  }

  private arcMove(): void {
    const canvas: any = document.getElementById('circle-progress-canvas');
    const circle = canvas.getContext('2d');
    circle.lineCap = 'round';
    const positionX = canvas.width / 2;
    const positionY = canvas.height / 2;
    const framesPerSecond = 1000 / 200;
    let percent = 0;
    const onePercent = 360 / 100;
    const result = onePercent * this.percent;
    let degree = 0;
    degree = this.resultPlaceHolder ? this.resultPlaceHolder : 0;

    const acrInterval = setInterval(() => {

      degree += 1;
      circle.clearRect(0, 0, canvas.width, canvas.height);
      percent = degree / onePercent;

      const startAngel = (Math.PI / 180) * 270;
      const endAngel = (Math.PI / 180) * (270 + 360);
      const radius = this.circleRadius;

      circle.beginPath();
      circle.strokeStyle = this.backGroundColor;
      circle.lineWidth = '3';
      circle.arc(positionX, positionY, radius, startAngel, endAngel);
      circle.stroke();

      circle.beginPath();
      circle.strokeStyle = this.progressColor;
      circle.lineWidth = '3';
      circle.arc(positionX, positionY, radius, startAngel, (Math.PI / 180) * (270 + degree));
      circle.stroke();

      if (degree >= result) {
        clearInterval(acrInterval);
      }
      this.resultPlaceHolder = result;
    }, framesPerSecond);
  }

}
