import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth/auth.guard';
import { CanDeactivateGuard } from '@guards/canDeactivate/can-deactivate.guard';

import { AdminPanelComponent } from '@components/admin/admin-panel/admin-panel.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { TaskComponent } from '@components/task/task.component';
import { WelcomePageComponent } from '@components/welcome-page/welcome-page.component';

import { AdminProfileComponent } from './components/admin/persons/profile/profile.component';
import { LeaderboardComponent } from '@components/leaderboard/table/leaderboard.component';
import { MultipleChoiceComponent } from '@components/multiple-choice/multiple-choice.component';
import { FeedbackComponent } from '@components/admin/feedback/feedback.component';
import { GiveFeedbackComponent } from '@components/give-feedback/give-feedback.component';
import { AdminTaskComponent } from '@components/admin/task/adminTask.component';
import { PersonsComponent } from '@components/admin/persons/persons/persons.component';
import { AdminMultipleChoiceComponent } from '@components/admin/admin-multiple-choice/admin-multiple-choice.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'challenge/:language',
    component: TaskComponent,
    children: [
      {
        path: ':id',
        component: TaskComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'multi/:language',
    component: MultipleChoiceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: PersonsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'users/:personId',
        component: AdminProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tasks',
        component: AdminTaskComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'multiplechoice',
        component: AdminMultipleChoiceComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [AuthGuard]
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'give_feedback',
    component: GiveFeedbackComponent,
    canActivate: [AuthGuard]
  },
  {
    // you have to be logged in to see this page
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
