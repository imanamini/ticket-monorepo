import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { StyledSwitchOption } from '../../../models/switch-option.model';
import { MessageService } from '@client-monorepo/common/utilities';
import { delay, of } from 'rxjs';
import { isPlatformBrowser, NgClass, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-ui-animated-switch-rounded',
  templateUrl: './ui-animated-switch-rounded.component.html',
  styleUrls: ['./ui-animated-switch-rounded.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, NgStyle],
})
export class UiAnimatedSwitchRoundedComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input()
  options: Array<StyledSwitchOption>;

  @Input() height = 40;

  @Input()
  selectedOption: StyledSwitchOption = null;

  @Input()
  enabled = true;

  @ViewChild('switchOptions', {
    static: false,
  })
  switchOptionsRef: ElementRef<HTMLUListElement>;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  highlightPosition = 0;

  styles = {};

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) public platformId: string,
    private messageService: MessageService,
  ) {
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
  }

  ngAfterViewInit(): void {
    if (this.switchOptionsRef) {
      of('')
        .pipe(delay(100))
        .subscribe({
          next: () => {
            this.calcHighlighterOffset();
            this.changeDetector.markForCheck();
          },
        });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.windowResizeCallback);
    }
    this.windowResizeCallback();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.windowResizeCallback);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedOption && changes.selectedOption.currentValue !== changes.selectedOption.previousValue) {
      of('')
        .pipe(delay(0))
        .subscribe({
          next: () => {
            this.makeStyles();
            this.calcHighlighterOffset();
          },
        });
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

    if (isPlatformBrowser(this.platformId)) {
      this.highlightPosition = index * el.getBoundingClientRect().width;
    }
  }

  optionClick(index, $event): void {
    if (!this.enabled) {
      return;
    }
    if (!this.options[index].isActive && this.options[index].hint) {
      this.showOptionHint(index);
      return;
    }
    // calculate from right, width * index gives us the amount
    // distance from right side of the switch
    this.highlightPosition = index * $event.target.getBoundingClientRect().width;
    this.selectedOption = this.options[index];
    this.changed.emit(this.selectedOption);
  }

  private showOptionHint(index) {
    this.messageService.showErrorMessage(this.options[index].hint);
  }

  private makeStyles(): void {
    const styles = {
      width: 100 / this.options.length + '%',
      height: this.height + 'px',
    };

    if (this.selectedOption) {
      styles['backgroundColor'] = this.selectedOption.backgroundColor || '#f0f5ff';
      styles['borderColor'] = this.selectedOption.borderColor || '#0040ff';
    }

    this.styles = styles;
  }
}
