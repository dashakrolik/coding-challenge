import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from 'src/app/types/Person';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private personUrl: string = 'http://localhost:8080/api/v1.0/person';

  constructor(
    private http: HttpClient
  ) { }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.personUrl);
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(this.personUrl + "/" + id);
  }

}
