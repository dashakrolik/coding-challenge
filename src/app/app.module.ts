import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { AceEditorModule } from 'ng2-ace-editor';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { JavascriptTaskComponent } from './components/output/javascript-task/javascript-task.component';
import { HttpClientModule } from '@angular/common/http';
import { CandidateComponent } from './components/candidate/candidate.component';

import { OverlayComponent } from './components/overlay/overlay/overlay.component';
import { SubscribeComponent } from './components/overlay/subscribe/subscribe.component';

@NgModule({
  declarations: [
    AppComponent,
    CodeEditorComponent,
    WelcomePageComponent,
    JavascriptTaskComponent,
    CandidateComponent,
    OverlayComponent,
    SubscribeComponent
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
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [OverlayComponent, SubscribeComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
