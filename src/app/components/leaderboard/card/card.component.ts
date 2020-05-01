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
  @Input('person') person: IPerson;
  languages$: Observable<ILanguage[]>;

  constructor(
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
  ) {
    this.languages$ = languageService.getLanguages();
  }

  getMailLink = () => {
    const url = 'mailto:' + this.person.username + '?subject=Hello from the coding challenge.';
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
