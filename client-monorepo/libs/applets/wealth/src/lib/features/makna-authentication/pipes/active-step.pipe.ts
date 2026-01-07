import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeStep',
  standalone: true
})
export class ActiveStepPipe implements PipeTransform {

  transform(index: number): number {
    return index - 1 > 0 ? index - 1 : 0;
  }

}
