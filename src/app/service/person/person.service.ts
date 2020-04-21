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

  getAllPersons = (): Observable<IPerson[]> => this.http.get('person');

  getPersonById = (id: number): Observable<IPerson> => this.http.get('person/' + id);

  updatePerson = (person: IPerson): Observable<IPerson> => this.http.put('person', person);

  deletePerson = (id: number): Observable<IPerson> => this.http.delete('person/' + id);
}
