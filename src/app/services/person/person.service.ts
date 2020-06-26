import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClientService } from '@services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  endpoint = 'person';

  constructor(
    private http: HttpClientService
  ) { }

  getAllPersons = (): Observable<IPerson[]> => this.http.get(this.endpoint);

  getPersonById = (id: number): Observable<IPerson> => this.http.get(this.endpoint + '/' + id);

  getPersonPoints = (): Observable<IPerson> => this.http.get(this.endpoint + '/points');

  getPersonProgress = (language: ILanguage): Observable<number> => this.http.post(this.endpoint + '/progress', language);

  updatePerson = (person: IPerson): Observable<IPerson> => this.http.put(this.endpoint, person);

  deletePerson = (person: IPerson): Observable<IPerson> => this.http.delete(this.endpoint + '/' + person.id, person);
}
