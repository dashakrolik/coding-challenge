import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { take } from 'rxjs/operators';

import { PersonService } from '@service/person/person.service';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.scss']
})
export class PersonTableComponent implements OnInit {

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Person>;
  dataSource: MatTableDataSource<Person>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'lastName', 'username'];

  ngOnInit() {
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      this.setDataSource(persons);
      this.dataSource.sort = this.sort;
    });
  }

  setDataSource = (data: Person[]) => {
    this.dataSource = new MatTableDataSource(data);
  }

  toProfile = (person: Person) => {
    this.router.navigate(['/admin/profile/' + person.id], { state: { person } });
  }

}
