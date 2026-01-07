import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

@Component({
  selector: "cash-out-applet-remaining-chart",
  standalone: true,
  templateUrl: "./cash-out-remaining-chart.component.html",
  styleUrl: "./cash-out-remaining-chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashOutRemainingChartComponent  {
  public progress = input.required<number>();
  public radius = input.required<number>();
  public stroke = input.required<number>();
  
  public normalizedRadius  =  computed(()=> this.radius() - this.stroke() / 2) 
  public circumference  =  computed(()=>  2 * Math.PI * this.normalizedRadius()) 
  public strokeDashoffset  =  computed(()=>  this.circumference() - (this.progress() / 100) * this.circumference()) 
  





}
