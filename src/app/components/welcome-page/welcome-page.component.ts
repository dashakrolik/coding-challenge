import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { Subscription, Observable } from 'rxjs';
import { LanguageService } from '@service/language/language.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit, OnDestroy {
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
  selectedLanguage: string;
  languagesSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
  }
  ngOnInit() {
    this.createForm();
    this.languagesSubscription = this.languageService.getLanguages().subscribe(languages => 
      this.languages = languages
    );
  }


  getLanguagesStrs = (): string[] => this.languages.map((item: Language) => item.language);

  createForm = () => this.form = this.formBuilder.group({});

  submit = () => {
    const { progressId } = this.user.exercise;
    const taskId = progressId || 1;

    this.router.navigateByUrl(`challenge/${this.selectedLanguage}/${taskId}`);
  }

  onSelect = (event: MatSelectChange) => this.selectedLanguage = event.value;

  ngOnDestroy(): void {
    this.languagesSubscription.unsubscribe();
  }
}
