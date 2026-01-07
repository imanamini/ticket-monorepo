import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlightKeywords]',
  standalone: true,
})
export class HighlightKeywordsDirective implements AfterViewInit {
  @Input() baseText!: string | undefined;
  @Input() keywords: string[] | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.highlightKeywords();
  }

  private highlightKeywords() {
    if (this.baseText && this.keywords && this.keywords?.length > 0) {
      this.keywords?.forEach((keyword) => {
        if (keyword.length > 0) {
          const pattern = new RegExp('(' + keyword + ')', 'igm');
          this.baseText = this.baseText?.replace(pattern, `<strong class="c-1 text-onback-high">$1</strong>`);
        }
      });

      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.baseText);
    }
  }
}
