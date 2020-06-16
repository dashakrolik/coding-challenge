import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { AceEditorModule } from 'ng2-ace-editor';

import { MatDialogProvider } from '@shared/constants';

import { AdminPanelComponent } from '@components/admin/admin-panel/admin-panel.component';
import { PersonTableComponent } from '@components/admin/person-table/person-table.component';
import { ProfileComponent as AdminProfileComponent } from '@components/admin/profile/profile.component';
import { SubmissionTableComponent } from '@components/admin/submission-table/submission-table.component';
import { TaskComponent as AdminTaskComponent } from '@components/admin/task/task.component';
import { CandidateComponent } from '@components/candidate/candidate.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { OverlayComponent } from '@components/overlay/overlay/overlay.component';
import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { SubmitDialogComponent } from '@components/submit-dialog/submit-dialog.component';
import { TaskComponent } from '@components/task/task.component';
import { LeaderboardComponent } from './components/leaderboard/table/leaderboard.component';
import { CardComponent } from './components/leaderboard/card/card.component';
import { WelcomePageComponent } from '@components/welcome-page/welcome-page.component';
import { MessageDialogComponent } from '@components/dialog/message-dialog/message-dialog.component';
import { OkCancelDialogComponent } from '@components/dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { CanvasComponent } from '@components/canvas/canvas.component';
import { FinishedPageComponent } from './components/finished-page/finished-page.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { authInterceptorProviders } from './guards/auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    WelcomePageComponent,
    CandidateComponent,
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
    SubmitDialogComponent,
    LeaderboardComponent,
    CardComponent,
    CanvasComponent,
    FinishedPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AceEditorModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    OverlayModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
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
