import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWidgetComponent } from './components/widgets/grid/grid-widget.component';
import { WidgetLoaderComponent } from './features/widget-loader/widget-loader.component';

@NgModule({
  declarations: [WidgetLoaderComponent, GridWidgetComponent],
  imports: [CommonModule],
  exports: [WidgetLoaderComponent],
})
export class WidgetLoaderModule {}
