import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {HttpClientService} from "../../service/http-client.service";
import {Candidate} from "../candidate/Candidate";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private routing: Router,
    private httpClientService:HttpClientService
  ) { }

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

  getForm = (): FormGroup =>
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email]
    })

    setExercise() {
      if (this.user.exercise.progressId === 0) {
        this.loadExerciseId = 1
      } else {
        this.loadExerciseId = this.user.exercise.progressId
      }
    }

    submit = (): void => {
      // send to backend
      // if success then proceed to redirect to code challenge
      // for now only this code:
      this.setExercise()
      console.log('submit')
      console.log('email:', this.form.value.email);
      console.log('first name:', this.form.value.firstName);
      console.log('last name:', this.form.value.lastName);
      // Create a new candidate, for now it has a placeholder for first name and last name.
      // Id is not necessary, it will create an id automatically in the backend.
      let candidate = new Candidate("0", this.form.value.firstName,this.form.value.lastName, this.form.value.email);
      this.httpClientService.createCandidate(candidate).subscribe(
        response => this.handleSuccessfulResponse(response),
      );
      this.routing.navigateByUrl('challenge/'+this.language+'/'+this.loadExerciseId);
    }

    getErrorMessageEmail() {
      return this.form.invalid ? 'Not a valid email' : null;
    }

    setLanguage (event: any) {
      this.language = event.value
    }


  getErrorMessageFirstName() {
    return this.form.invalid ? 'please give a first name' : null;
  }

  getErrorMessageLastName() {
    return this.form.invalid ? 'please give a last name' : null;
  }

  handleSuccessfulResponse(response) {
      // TODO: do something with a successful response
      console.log("successful post message");
  }
}


submissions: [
  { userId: 1, chosenLanguage: 'java', exercise: { progressId: 0, exerciseId: 1 } },
  { userId: 2, chosenLanguage: 'javaScript', exercise: { progressId: 0, exerciseId: 1 } }
]
