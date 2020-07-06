import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { PersonService } from '@services/person/person.service';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.scss']
})
export class PersonTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<IPerson>;
  dataSource: MatTableDataSource<IPerson>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'lastName', 'username'];

  constructor(
    private personService: PersonService,
    private router: Router,
    private adminService: AdminService,
  ) {
    adminService.activeComponent.next('users');
  }

  ngOnInit() {
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      this.setDataSource(persons);
      this.dataSource.sort = this.sort;
      this.dataSource.sort.sort({ id: 'id', start: 'asc', disableClear: false });
    });
  }

  setDataSource = (data: IPerson[]) => {
    this.dataSource = new MatTableDataSource(data);
  }

  toProfile = (person: IPerson) => {
    this.router.navigate(['/admin/users/' + person.id]);
  }

}
