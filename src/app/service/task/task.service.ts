import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskUrl: string = 'http://localhost:8080/api/v1.0/task';

  constructor(
    private http: HttpClient
  ) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskUrl);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(this.taskUrl + "/" + id);
  }

}
