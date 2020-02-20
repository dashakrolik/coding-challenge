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
      console.log(this.form.value.email);
      this.routing.navigateByUrl('challenge');
    }

    getErrorMessage() {
      return this.form.invalid ? 'Not a valid email' : null;
    }

}