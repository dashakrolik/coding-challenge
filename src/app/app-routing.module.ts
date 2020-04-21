import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent } from '@components/task/task.component';
import { WelcomePageComponent } from '@components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from '@components/output/javascript-task/javascript-task.component';
import { CandidateComponent } from '@components/candidate/candidate.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { AuthGuard } from '@guards/auth/auth.guard';
import { AdminPanelComponent } from '@components/admin/admin-panel/admin-panel.component';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'challenge/:language',
    component: TaskComponent,
    children: [
      {
        path: ':id',
        component: TaskComponent,
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
