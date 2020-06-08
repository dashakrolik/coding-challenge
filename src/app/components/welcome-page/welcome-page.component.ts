import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { ComponentType } from '@angular/cdk/portal';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LanguageService } from '@services/language/language.service';
import { TokenStorageService } from '@services/token/token-storage.service';
import { OverlayService } from '@services/overlay/overlay.service';

import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';

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
  subscribeComponent = SubscribeComponent;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private languageService: LanguageService,
    private tokenStorageService: TokenStorageService,
    private overlayService: OverlayService,
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

  loginWindow(content: ComponentType<SubscribeComponent>) {
    this.overlayService.open(content, null);
  }
  
  onSelect = (event: MatSelectChange) => this.selectedLanguage = event.value;

  checkIsLoggedIn = (): boolean => {
    if (!this.tokenStorageService.isUserLoggedIn()) {
      this.loginWindow(this.subscribeComponent);
    }
    return this.tokenStorageService.isUserLoggedIn();
  }
}
  


