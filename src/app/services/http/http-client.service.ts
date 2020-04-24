import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { baseUrl } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient
  ) { }

  get = (path: string): Observable<any> => this.http.get(`${baseUrl}/${path}`);

  post<T>(path: string, payload: T): Observable<any> {
    return this.http.post(`${baseUrl}/${path}`, payload);
  }

  put<T>(path: string, payload: T): Observable<any> {
    return this.http.put(`${baseUrl}/${path}`, payload);
  }

  delete<T>(path: string, payload: T): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: payload
    };
    return this.http.delete(`${baseUrl}/${path}`, options);
  }
}
