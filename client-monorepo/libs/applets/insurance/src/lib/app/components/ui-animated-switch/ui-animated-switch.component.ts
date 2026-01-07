import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NgClass, NgFor, NgStyle } from '@angular/common';

export type StyledSwitchOption = {
  backgroundColor?: string;
  borderColor?: string;
  label: string;
  value: any;
};

@Component({
  selector: 'ui-animated-switch',
  templateUrl: './ui-animated-switch.component.html',
  styleUrls: ['./ui-animated-switch.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, NgStyle]
})
export class UiAnimatedSwitchComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input()
  options: Array<StyledSwitchOption>;

  @Input()
  height = 35;

  @Input()
  selectedOption: StyledSwitchOption = null;

  @Input()
  enabled = true;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  @ViewChild('switchOptions', {
    static: false
  })
  switchOptionsRef: ElementRef<HTMLUListElement>;

  highlightPosition = 0;

  styles = {};

  constructor(private changeDetector: ChangeDetectorRef) {
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
  }

  ngAfterViewInit(): void {
    if (this.switchOptionsRef) {
      setTimeout(() => {
        this.calcHighlighterOffset();
        this.changeDetector.markForCheck();
      }, 100);
    }
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.windowResizeCallback);

    this.windowResizeCallback();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeCallback);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedOption && changes.selectedOption.currentValue !== changes.selectedOption.previousValue) {
      this.makeStyles();
      this.calcHighlighterOffset();
    }
  }

  windowResizeCallback(): void {
    this.makeStyles();
    this.calcHighlighterOffset();
  }

  calcHighlighterOffset(): void {
    if (!this.switchOptionsRef || !this.selectedOption) {
      return;
    }
    // find index of the selected option
    let index = 0;
    this.options.forEach((o, i) => {
      if (o.value === this.selectedOption.value) {
        index = i;
      }
    });

    const el = this.switchOptionsRef.nativeElement.children.item(index) as any;
    // calculate from right, width * index gives us the amount
    // distance from right side of the switch
    this.highlightPosition = index * el.getBoundingClientRect().width;
  }

  optionClick(index, $event): void {
    if (!this.enabled) {
      return;
    }
    // calculate from right, width * index gives us the amount
    // distance from right side of the switch
    this.highlightPosition = index * $event.target.getBoundingClientRect().width;
    this.selectedOption = this.options[index];
    this.changed.emit(this.selectedOption);
  }

  private makeStyles(): void {
    const styles = {
      width: (100 / this.options.length) + '%',
      height: this.height - 5 + 'px'
    };

    if (this.selectedOption) {
      styles['backgroundColor'] = this.selectedOption.backgroundColor || '#f0f5ff';
      styles['borderColor'] = this.selectedOption.borderColor || '#0040ff';
    }

    this.styles = styles;
  }

}
