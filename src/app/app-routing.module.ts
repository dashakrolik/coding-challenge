import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from './components/output/javascript-task/javascript-task.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'challenge/:language',
    component: CodeEditorComponent,
    children: [
      {
        path: ':id',
        component: CodeEditorComponent, 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
