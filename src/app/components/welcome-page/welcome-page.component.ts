import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private routing: Router
  ) {
  }

  email: string;
  form: FormGroup;
  squareMargin = 'margin-left: 20px';
  language: 'java';
  user = {
    email: 'test@test.nl',
    language: 'java',
    exercise: {
      progressId: 0,
      exerciseId: 1
    }
  }
  loadExerciseId: any

  ngOnInit() {
    this.getForm();
  }

  getForm() {
    this.form = this.formBuilder.group({})
  }

  setExercise() {
    if (this.user.exercise.progressId === 0) {
      this.loadExerciseId = 1
    } else {
      this.loadExerciseId = this.user.exercise.progressId
    }
  }

  submit() {
    // send to backend
    // if success then proceed to redirect to code challenge
    // for now only this code:
    this.setExercise()
    this.routing.navigateByUrl('challenge/' + this.language + '/' + this.loadExerciseId);
  }

  setLanguage(event: any) {
    this.language = event.value
  }

  getLanguage() {
    return this.language === undefined;
  }
}
