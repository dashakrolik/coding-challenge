import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LanguageService } from '@services/language/language.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('person') person: IPerson;
  languages$: Observable<ILanguage[]>;

  showNotification = true;

  constructor(
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
  ) {
    this.languages$ = languageService.getLanguages();
  }

  onCloseClick(): void {
    this.showNotification = !this.showNotification;
    console.log(this.showNotification);
    console.log(this.person);
  }

  getMailLink = () => {
    const url = 'mailto:' + this.person.username + '?subject=Hello from the coding challenge.';
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
