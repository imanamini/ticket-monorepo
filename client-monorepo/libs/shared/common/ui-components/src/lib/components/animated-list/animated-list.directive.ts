import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[AnimatedListDirective]',
  standalone: true,
})
export class AnimatedListDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
