import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { Subscription, Observable } from 'rxjs';
import { LanguageService } from '@service/language/language.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  email: string;
  form: FormGroup;
  squareMargin = 'margin-left: 20px';
  user = {
    email: 'test@test.nl',
    language: 'java',
    exercise: {
      progressId: 0,
      exerciseId: 1
    }
  };
  selectedLanguage: string;
  languageNames$: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.createForm();

    // get just the names of the languages
    this.languageNames$ = this.languageService.getLanguages().pipe(
      map(languages =>
        languages.map(lang => lang.language)
      )
    );
  }

  createForm = () => this.form = this.formBuilder.group({});

  submit = () => {
    const { progressId } = this.user.exercise;
    const taskId = progressId || 1;

    this.router.navigateByUrl(`challenge/${this.selectedLanguage}/${taskId}`);
  }

  onSelect = (event: MatSelectChange) => this.selectedLanguage = event.value;

}
