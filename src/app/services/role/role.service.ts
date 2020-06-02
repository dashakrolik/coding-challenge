import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // TODO: store these in the backend and retrieve them from there.
  private allRoles: IRole[] = [
    { id: 1, name: 'ROLE_USER' },
    { id: 2, name: 'ROLE_MODERATOR' },
    { id: 3, name: 'ROLE_ADMIN' }
  ];

  constructor() { }

  getRoles = (): Observable<IRole[]> => of(this.allRoles);

}
