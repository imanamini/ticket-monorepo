import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { register } from 'swiper/element';
register();

@NgModule({
  imports: [CommonModule, PagesRoutingModule],
  exports: [],
  declarations: [],
})
export class PagesModule {}
