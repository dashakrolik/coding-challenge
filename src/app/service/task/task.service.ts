import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  languages: Observable<string[]>;

  constructor(
    private http: HttpClientService
  ) { }

  getTask = (subTaskNumber: number): Observable<string[]> => this.http.get('/api/v1.0/task' + subTaskNumber + '/');
}
