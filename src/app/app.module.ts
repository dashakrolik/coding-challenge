import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AceEditorModule } from 'ng2-ace-editor';

import { MatDialogProvider } from '@shared/constants';

import { AdminPanelComponent } from '@components/admin/admin-panel/admin-panel.component';
import { PersonTableComponent } from '@components/admin/persons/person-table/person-table.component';
import { AdminProfileComponent } from '@components/admin/persons/profile/profile.component';
import { FeedbackComponent } from './components/admin/feedback/feedback.component';
import { GiveFeedbackComponent } from './components/give-feedback/give-feedback.component';
import { AdminTaskComponent } from '@components/admin/task/adminTask.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { OverlayComponent } from '@components/overlay/overlay/overlay.component';
import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { TaskComponent } from '@components/task/task.component';
import { LeaderboardComponent } from './components/leaderboard/table/leaderboard.component';
import { WelcomePageComponent } from '@components/welcome-page/welcome-page.component';
import { MessageDialogComponent } from '@components/dialog/message-dialog/message-dialog.component';
import { OkCancelDialogComponent } from '@components/dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { CanvasComponent } from '@components/canvas/canvas.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { authInterceptorProviders } from './guards/auth/auth.interceptor';
import { MultipleChoiceComponent } from './components/multiple-choice/multiple-choice.component';
import { PersonsComponent } from './components/admin/persons/persons/persons.component';
import { AdminMultipleChoiceComponent } from './components/admin/admin-multiple-choice/admin-multiple-choice.component';
import { MultipleChoiceTableComponent } from './components/admin/persons/multiple-choice-table/multiple-choice-table.component';
import { SubmissionTableComponent } from '@components/admin/persons/submission-table/submission-table.component';
import { CardDialogComponent } from '@components/dialog/card-dialog/card-dialog.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    WelcomePageComponent,
    OverlayComponent,
    SubscribeComponent,
    DropdownComponent,
    ProfileComponent,
    AdminPanelComponent,
    AdminTaskComponent,
    AdminProfileComponent,
    PersonTableComponent,
    SubmissionTableComponent,
    OkCancelDialogComponent,
    MessageDialogComponent,
    DropdownComponent,
    LeaderboardComponent,
    CanvasComponent,
    MultipleChoiceComponent,
    FeedbackComponent,
    GiveFeedbackComponent,
    PersonsComponent,
    AdminMultipleChoiceComponent,
    MultipleChoiceTableComponent,
    CardDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AceEditorModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    FormsModule,
    AppMaterialModule
  ],
  providers: [
    authInterceptorProviders,
    MatDialogProvider,
    MatDialogModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    OverlayComponent,
    SubscribeComponent,
    MessageDialogComponent,
    OkCancelDialogComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})

export class AppModule {
}
