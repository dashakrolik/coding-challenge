import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages: Observable<string[]>;

  constructor(
    private http: HttpClientService
  ) { }

  getLanguages = (): Observable<string[]> => this.http.get('language');
}
