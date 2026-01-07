import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignDocumentsComponent } from './sign-documents/sign-documents.component';

const routes: Routes = [
  {
    path: '',
    component: SignDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepSignDocumentsRoutingModule { }
