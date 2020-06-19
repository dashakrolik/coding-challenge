import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  endpoint = 'task';

  constructor(
    private http: HttpClientService
  ) { }

  getAllTasks = (): Observable<ITask[]> => this.http.get(this.endpoint);
  
  getTask = (subTaskNumber: number): Observable<ITask> => this.http.get(this.endpoint + '/' + subTaskNumber);

  getTotalNumberOfTasks = (): Observable<number> => this.http.get(this.endpoint + '/' + 'all');

}
