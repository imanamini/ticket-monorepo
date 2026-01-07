import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnplPageComponent } from './bnpl-page/bnpl-page.component';
import { BnplWrapperRoutingModule } from './bnpl-wrapper-routing.module';

@NgModule({
  imports: [CommonModule, BnplWrapperRoutingModule, BnplPageComponent],
})
export class BnplWrapperModule {
}
