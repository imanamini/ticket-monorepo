import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesSelectionComponent } from './rules-selection.component';

const routes: Routes = [
  {
    path: '',
    component: RulesSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesSelectionRoutingModule {
}
