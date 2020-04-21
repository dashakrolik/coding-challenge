import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClientService } from '@service/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(
    private http: HttpClientService
  ) { }

  getTheme = (languageName: string): string => {
    // TODO store the theme in the database as well
    switch (languageName) {
      case 'javascript': return 'dracula';
      case 'python': return 'monokai';
      case 'java': return 'eclipse'; // java theme
      default: throw new Error(`No editor theme specified for this language: ${languageName}.`)
    }
  }

  getLanguages = (): Observable<Language[]> => this.http.get('language').pipe(
    map((languages: Language[]) =>
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
  getLanguagesMap = (): Observable<Map<string, Language>> => {
    const hashMap = new Map<string, Language>();
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
