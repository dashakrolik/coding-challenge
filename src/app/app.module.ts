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

import { AppComponent } from './app.component';
import { CodeEditorComponent } from '@components/code-editor/code-editor.component';
import { WelcomePageComponent } from '@components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from '@components/output/javascript-task/javascript-task.component';
import { CandidateComponent } from '@components/candidate/candidate.component';
import { OverlayComponent } from '@components/overlay/overlay/overlay.component';
import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { AdminPanelComponent } from '@components/admin/admin-panel/admin-panel.component';
import { TaskComponent } from '@components/admin/task/task.component';
import { PersonTableComponent } from '@components/admin/person-table/person-table.component';
import { ProfileComponent } from '@components/admin/profile/profile.component';
import { SubmissionTableComponent } from '@components/admin/submission-table/submission-table.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    CodeEditorComponent,
    WelcomePageComponent,
    JavascriptTaskComponent,
    CandidateComponent,
    OverlayComponent,
    SubscribeComponent,
    DropdownComponent,
    ProfileComponent,
    AdminPanelComponent,
    TaskComponent,
    PersonTableComponent,
    SubmissionTableComponent,
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
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [OverlayComponent, SubscribeComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
