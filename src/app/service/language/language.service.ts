import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private http: HttpClientService
  ) { }

  getLanguages = (): Observable<Language[]> => this.http.get('language');
}
