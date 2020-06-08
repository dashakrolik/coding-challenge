import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LanguageService } from '@services/language/language.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  form: FormGroup;
  taskId = 1;
  selectedLanguage: string;
  languageNames: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.languageNames = this.languageService.getLanguages().pipe(
      map(languages =>
        languages.map(lang => lang.language)
      )
    );
  }

  createForm = () => this.form = this.formBuilder.group({});

  submit = () => {
    this.router.navigateByUrl(`challenge/${this.selectedLanguage}/${this.taskId}`);
  }

  onSelect = (event: MatSelectChange) => this.selectedLanguage = event.value;

}
