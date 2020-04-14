import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { LanguageService } from '@service/language/language.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  email: string;
  form: FormGroup;
  squareMargin = 'margin-left: 20px';
  languages: Language[] = [];
  user = {
    email: 'test@test.nl',
    language: 'java',
    exercise: {
      progressId: 0,
      exerciseId: 1
    }
  };
  taskId: number;
  selectedLanguage: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
  }
  ngOnInit() {
    this.getForm();
    this.getLanguages();
  }

  getForm = () => this.form = this.formBuilder.group({});

  getLanguages = () => {
    this.languageService.getLanguages().subscribe(
      response => this.languages = response
    );
  }

  setLanguage = () => this.languages.map(item => item.language);

  setExercise() {
    const { progressId } = this.user.exercise;

    if (progressId === 0) {
      this.taskId = 1;
      if (progressId === 0) {
        this.taskId = 1;
      } else {
        this.taskId = progressId;
      }
    }
  }

  submit = () => {
    this.setExercise();
    this.router.navigateByUrl('challenge/' + this.selectedLanguage + '/' + this.taskId);
  }

  getLanguage = () => this.languages === undefined;

  onSelect = (event: MatSelectChange) => this.selectedLanguage = event.value;
}
