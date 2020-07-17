import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';

import { Subscription } from 'rxjs';

import { LanguageService } from '@services/language/language.service';
import { TokenStorageService } from '@services/token/token-storage.service';
import { OverlayService } from '@services/overlay/overlay.service';

import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { PersonService } from '@services/person/person.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  
  languageNames$: Observable<string[]>;

  taskId = 1;
  selectedLanguage: string;
  $languageSubscription: Subscription;
  subscribeComponent = SubscribeComponent;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private tokenStorageService: TokenStorageService,
    private overlayService: OverlayService,
    private personService: PersonService,
  ) {
  }

  ngOnInit() {

    // get just the names of the languagess
    this.languageNames$ = this.languageService.getLanguages().pipe(
      map(languages => 
        languages.map(lang => lang.language)
      )
    );
  }

  submit = () => {
    if (this.checkIsLoggedIn()) {
      this.personService.getPersonProgress(this.selectedLanguage).subscribe(multipleChoiceCompleted => {
        if (multipleChoiceCompleted) {
          this.router.navigateByUrl(`challenge/${this.selectedLanguage}/${this.taskId}`);
        } else {
          this.router.navigateByUrl(`multi/${this.selectedLanguage}`);
        }
      });
    }
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    this.overlayService.open(content, null);
  }

  onSelect = (event: MatSelectChange) => {
    this.selectedLanguage = event.value;
  }

  checkIsLoggedIn = (): boolean => {
    if (!this.tokenStorageService.isUserLoggedIn()) {
      this.loginWindow(this.subscribeComponent);
    }
    return this.tokenStorageService.isUserLoggedIn();
  }
}
