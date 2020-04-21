import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AceEditorModule } from 'ng2-ace-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { AppRoutingModule } from './app-routing.module';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SubmitDialogComponent } from '@components/submit-dialog/submit-dialog.component';
import { WelcomePageComponent } from '@components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from '@components/output/javascript-task/javascript-task.component';
import { CandidateComponent } from '@components/candidate/candidate.component';
import { OverlayComponent } from '@components/overlay/overlay/overlay.component';
import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { AdminPanelComponent } from '@components/admin/admin-panel/admin-panel.component';
import { TaskComponent as AdminTaskComponent } from '@components/admin/task/task.component';
import { PersonTableComponent } from '@components/admin/person-table/person-table.component';
import { ProfileComponent } from '@components/admin/profile/profile.component';
import { SubmissionTableComponent } from '@components/admin/submission-table/submission-table.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { authInterceptorProviders } from './guards/auth/auth.interceptor';
import { AppComponent } from './app.component';
import { TaskComponent } from '@components/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    WelcomePageComponent,
    JavascriptTaskComponent,
    CandidateComponent,
    OverlayComponent,
    SubscribeComponent,
    DropdownComponent,
    ProfileComponent,
    AdminPanelComponent,
    AdminTaskComponent,
    PersonTableComponent,
    SubmissionTableComponent,
    DropdownComponent,
    SubmitDialogComponent,
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
    MatDialogModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  entryComponents: [OverlayComponent, SubscribeComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
