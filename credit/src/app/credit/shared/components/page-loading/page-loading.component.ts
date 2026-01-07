import { Component, Input  } from '@angular/core';

@Component({
  selector: 'page-loading',
  templateUrl: './page-loading.component.html',
  styleUrls: ['./page-loading.component.scss']
})
export class PageLoadingComponent {
  @Input()
  active: boolean = false;

  @Input()
  height: string;

  getStyles(){
    let styles = {};

    if(this.height){
      styles['height'] = this.height;
    }

    return styles;
  }

}
