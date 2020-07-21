import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  activeComponent = new BehaviorSubject<string>(undefined);

  constructor() { }
}
