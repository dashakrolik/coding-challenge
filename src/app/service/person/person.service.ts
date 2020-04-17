import { Injectable } from '@angular/core';
import { HttpClientService } from '@service/http/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(
    private http: HttpClientService
  ) { }

  getAllPersons = (): Observable<Person[]> => this.http.get('person');

  getPersonById = (id: number): Observable<Person> => this.http.get('person/' + id);

  updatePerson = (person: Person): Observable<Person> => this.http.put<Person>('person', person);

  deletePerson = (person: Person): Observable<Person> => this.http.delete<Person>('person', person);
}
