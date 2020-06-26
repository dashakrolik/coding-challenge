import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';

import { Subscription } from 'rxjs';

import { LanguageService } from '@services/language/language.service';
import { TokenStorageService } from '@services/token/token-storage.service';
import { OverlayService } from '@services/overlay/overlay.service';

import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';
import { PersonService } from '@services/person/person.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  taskId = 1;
  selectedLanguage: ILanguage;
  languages: ILanguage[];
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
    this.$languageSubscription = this.languageService.getLanguages().subscribe(languages => {
      this.languages = languages;
    });
  }

  submit = () => {
    this.checkIsLoggedIn();
    this.personService.getPersonProgress(this.selectedLanguage).subscribe(locationNumber => {
      if (locationNumber === 0) {
        this.router.navigateByUrl(`challenge/${this.selectedLanguage.language}/${this.taskId}`);
      } else {
        this.router.navigateByUrl(`multi/${this.selectedLanguage.language}/${locationNumber}`);
      }
    });
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    this.overlayService.open(content, null);
  }

  checkIsLoggedIn = (): boolean => {
    if (!this.tokenStorageService.isUserLoggedIn()) {
      this.loginWindow(this.subscribeComponent);
    }
    return this.tokenStorageService.isUserLoggedIn();
  }
}



