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

  getTask = (subTaskNumber: number): Observable<ITask> => this.http.get(this.endpoint + '/' + subTaskNumber);

  getAllTasks = (): Observable<ITask[]> => this.http.get(this.endpoint);

  getTotalNumberOfTasks = (): Observable<number> => this.http.get(this.endpoint + '/' + 'all');

  saveTask = (task: ITask): Observable<ITask> => {
    return this.http.post(this.endpoint, task);
  }

}
