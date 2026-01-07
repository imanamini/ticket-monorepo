import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlightKeywords]',
  standalone: true,
})
export class HighlightKeywordsDirective implements AfterViewInit {
  @Input() baseText!: string | undefined;
  @Input() keywords: string[] | undefined;

  private readonly doc = document;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.renderSafe();
  }

  private renderSafe() {
    const host = this.el.nativeElement;

    while (host.firstChild) {
      host.removeChild(host.firstChild);
    }

    const text = this.baseText ?? '';
    const keywords = (this.keywords ?? []).filter(k => !!k).map(k => escapeRegExp(k));

    if (!text || keywords.length === 0) {
      this.renderer.appendChild(host, this.doc.createTextNode(text));
      return;
    }

    keywords.sort((a, b) => b.length - a.length);
    const pattern = new RegExp('(' + keywords.join('|') + ')', 'ig');

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        const before = text.slice(lastIndex, matchIndex);
        this.renderer.appendChild(host, this.doc.createTextNode(before));
      }

      const strong = this.renderer.createElement('strong');
      this.renderer.addClass(strong, 'c-1');
      this.renderer.addClass(strong, 'text-onback-high');

      const matchedText = match[0];
      this.renderer.appendChild(strong, this.doc.createTextNode(matchedText));
      this.renderer.appendChild(host, strong);

      lastIndex = matchIndex + matchedText.length;
    }

    if (lastIndex < text.length) {
      const rest = text.slice(lastIndex);
      this.renderer.appendChild(host, this.doc.createTextNode(rest));
    }
  }
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
