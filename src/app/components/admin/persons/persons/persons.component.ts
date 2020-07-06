import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  constructor(
    private adminService: AdminService,
  ) {
    adminService.activeComponent.next('users');
  }

  ngOnInit(): void {
  }

}
