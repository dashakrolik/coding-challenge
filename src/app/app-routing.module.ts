import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { CandidateComponent } from "./components/candidate/candidate.component";
import {ProfileComponent} from "./components/profile/profile.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
