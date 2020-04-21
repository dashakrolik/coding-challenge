import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '@shared/constants';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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

  delete = (path: string): Observable<any> => {
    return this.http.delete(`${baseUrl}/${path}`);
  }
}
