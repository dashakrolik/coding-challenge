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

<<<<<<< HEAD
  getTotalNumberOfTasks = (): Observable<number> => this.http.get(this.endpoint + '/' + 'all');

=======
  getTotalNumberOfTasks = (language: string) => this.http.get(this.endpoint + '/' + 'all');
>>>>>>> fee1fef9f3c5f7dc0a9e1b44fc8fff21fb0f0184
}
