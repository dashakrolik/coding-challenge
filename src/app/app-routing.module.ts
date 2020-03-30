import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { CandidateComponent } from "./components/candidate/candidate.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthGuardService } from "./service/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    // you have to be logged in to see this page
    path: 'candidates', canActivate:[AuthGuardService],
    component: CandidateComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
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
