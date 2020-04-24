import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClientService
  ) { }

  getTask = (subTaskNumber: number): Observable<ITask> => this.http.get('task/' + subTaskNumber);

  getAllTasks = (): Observable<ITask[]> => this.http.get('task');
}
