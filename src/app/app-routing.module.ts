import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from './components/output/javascript-task/javascript-task.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { ProfileComponent } from "./components/profile/profile.component";
import { AuthGuardService } from '@service/auth/auth-guard.service';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    // you have to be logged in to see this page
    path: 'candidates',
    component: CandidateComponent,
    canActivate:[AuthGuardService]
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
