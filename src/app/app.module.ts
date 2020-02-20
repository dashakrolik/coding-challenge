import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [
    AppComponent,
    CodeEditorComponent,
    WelcomePageComponent
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
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
