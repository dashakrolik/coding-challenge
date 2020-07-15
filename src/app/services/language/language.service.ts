import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClientService } from '@services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(
    private http: HttpClientService
  ) { }

  languages: BehaviorSubject<ILanguage[]> = new BehaviorSubject(undefined);
  selectedLanguage: BehaviorSubject<ILanguage> = new BehaviorSubject(undefined);

  getTheme = (languageName: string): string => {
    // TODO store the theme in the database as well
    switch (languageName) {
      case 'Javascript': return 'dracula';
      case 'Python': return 'monokai';
      case 'Java': return 'eclipse'; // java theme
      case 'CSharp': return 'monokai'; // TODO: Find editor for c sharp
      case 'Scala': return 'monokai'; // TODO: find editor for scala.
      default: throw new Error(`No editor theme specified for this language: ${languageName}.`);
    }
  }

  getLanguages = (): Observable<ILanguage[]> => this.http.get('language').pipe(
    map((languages: ILanguage[]) =>
      languages.map(lang => {
        lang.editorTheme = this.getTheme(lang.language);
        return lang;
      })
    )
  )

  /**
   * Get a map of the languages. This is much faster than looping » O(1)
   * this.languagesMap.get('javascript'); // { id: 1, language: 'javascript', ...}
   */
  getLanguagesMap = (): Observable<Map<string, ILanguage>> => {
    const hashMap = new Map<string, ILanguage>();
    return this.getLanguages()
      .pipe(
        map(languages => {
          languages.forEach(lang =>
            hashMap.set(lang.language, lang)
          );
          return hashMap;
        }
        )
      );
  }
}
