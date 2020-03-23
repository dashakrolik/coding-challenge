import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Candidate } from "../candidate/Candidate";
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
  loadExerciseId: any
  selectedLanguage: any

  ngOnInit() {
    this.getForm();
    this.getLanguage()
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

  getLanguage() {
    this.httpClientService.getLanguage().subscribe(
      response => this.handleSuccessfulResponseGetLanguage(response)
    );
  }

  handleSuccessfulResponseGetLanguage(response) {
    console.log("successful post message get language");
    let languageId = response.id;
    let languageName = response.language;
    this.languages = response;
    console.log(response)
  }
  

  submit() {
    // send to backend
    // if success then proceed to redirect to code challenge
    // for now only this code:
    this.setExercise()
    this.routing.navigateByUrl('challenge/' + this.languages + '/' + this.loadExerciseId);
  }

  getLanguage() {
    return this.languages === undefined;
  }
}
