import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientService } from "../../service/http/http-client.service";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private routing: Router,
    private httpClientService: HttpClientService
    
  ) {
  }

  email: string;
  form: FormGroup;
  squareMargin = 'margin-left: 20px';
  languages: any;
  user = {
    email: 'test@test.nl',
    language: 'java',
    exercise: {
      progressId: 0,
      exerciseId: 1
    }
  }
  loadExerciseId: number
  selectedLanguage: string

  ngOnInit() {
    this.getForm();
    this.getLanguages()
  }

  getForm() {
    this.form = this.formBuilder.group({})
  }

  setLanguage() {
    if (this.languages) {
      return this.languages.map(item => item.language)
    }
  }

  setExercise() {
    if (this.user.exercise.progressId === 0) {
      this.loadExerciseId = 1
    } else {
      this.loadExerciseId = this.user.exercise.progressId
    }
  }

  async getLanguages() {
      await this.httpClientService.getLanguage().subscribe(
        response => this.languages = response
      );
  }

  submit() {
    // send to backend
    // if success then proceed to redirect to code challenge
    // for now only this code:
    this.setExercise()
    this.routing.navigateByUrl('challenge/' + this.selectedLanguage + '/' + this.loadExerciseId);
  }

  getLanguage() {
    return this.languages === undefined;
  }

  onSelect(event) {
    this.selectedLanguage = event
  }
}
