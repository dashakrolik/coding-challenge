import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from './components/output/javascript-task/javascript-task.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { CandidateComponent } from './components/candidate/candidate.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'candidates',
    component: CandidateComponent
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
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
  },
  {
    path: 'admin/profile/:id',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
