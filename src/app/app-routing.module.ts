import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';

const routes: Routes = [
  {
    path: '',
    component: CodeEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
