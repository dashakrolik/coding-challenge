import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LanguageService} from '@services/language/language.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss']
})
export class CardDialogComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('person') person: IPerson;
  languages$: Observable<ILanguage[]>;

  showNotification = true;

  constructor(private sanitizer: DomSanitizer,
              private languageService: LanguageService) {
    this.languages$ = languageService.getLanguages();
  }

  ngOnInit(): void {
  }

  printsth(): void { console.log(this.showNotification);
                     console.log(this.person);
  }

  onCloseClick(): void {
    this.showNotification = !this.showNotification;
    console.log(this.showNotification);
  }

}
