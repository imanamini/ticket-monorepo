import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface Segment {
  startAngle: number;
  endAngle: number;
  filled: boolean;
}

interface DividingLine {
  x: number;
  y: number;
}

@Component({
  selector: 'app-circle-indicator',
  templateUrl: './circle-indicator.component.html',
  styleUrls: ['./circle-indicator.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleIndicatorComponent {
  // Signals
  size = input<string>('18px');
  allSectorsCount = input(3);
  primarySectorsCount = input(1);
  primaryColor = input<string>('#7400E7');
  secondaryColor = input<string>('#EFDEFF');
  segments = computed<Segment[]>(() => this.generateSegments());
  dividingLines = computed<DividingLine[]>(() => this.generateDividingLines());

  generateSegments() {
    const segments: Segment[] = [];
    const anglePerSegment = 360 / this.allSectorsCount();

    for (let i = 0; i < this.allSectorsCount(); i++) {
      const startAngle = i * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;
      segments.push({
        startAngle,
        endAngle,
        filled: i < this.primarySectorsCount(),
      });
    }
    return segments;
  }

  generateDividingLines() {
    const dividingLines: DividingLine[] = [];
    const anglePerSegment = 360 / this.allSectorsCount();
    const radius = 50;

    for (let i = 0; i < this.allSectorsCount(); i++) {
      const angle = i * anglePerSegment;
      const point = this.polarToCartesian(radius, angle);
      dividingLines.push(point);
    }
    return dividingLines;
  }

  getPath(startAngle: number, endAngle: number): string {
    const radius = 50;
    const start = this.polarToCartesian(radius, startAngle);
    const end = this.polarToCartesian(radius, endAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [`M 50 50`, `L ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, `Z`].join(' ');
  }

  polarToCartesian(radius: number, angleInDegrees: number): { x: number; y: number } {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: 50 + radius * Math.cos(angleInRadians),
      y: 50 + radius * Math.sin(angleInRadians),
    };
  }
}
