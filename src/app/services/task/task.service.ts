import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable } from 'rxjs';

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