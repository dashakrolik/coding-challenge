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

  ngOnInit() {
    this.getForm();
  }

  getForm = (): FormGroup =>
    this.form = this.formBuilder.group({
      email: ['', Validators.email]
    })

    submit = (): void => {
      // send to backend
      // if success then proceed to redirect to code challenge
      // for now only this code:
      console.log('email:', this.form.value.email);
      // Create a new candidate, for now it has a placeholder for first name and last name.
      // Id is not necessary, it will create an id automatically in the backend.
      // TODO: replace placeholders with actual names.
      let candidate = new Candidate("0", "test","TEST", this.form.value.email);
      this.httpClientService.createCandidate(candidate).subscribe(
        response => this.handleSuccessfulResponse(response),
      );
      this.routing.navigateByUrl('challenge');
    }

    getErrorMessage() {
      return this.form.invalid ? 'Not a valid email' : null;
    }

  handleSuccessfulResponse(response) {
      // TODO: do something with a successful response
      console.log("successful post message");
  }
}
