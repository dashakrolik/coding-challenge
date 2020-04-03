import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PersonService } from 'src/app/service/person/person.service';
import { Router } from '@angular/router';
import { Person } from 'src/app/types/Person.d';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.css']
})
export class PersonTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Person>;
  dataSource: MatTableDataSource<Person>;

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'lastName', 'email'];

  ngOnInit() {
    // this.dataSource = new PersonTableDataSource();
    this.personService.getAllPersons().toPromise().then(persons => this.setDataSource(persons));
  }

  setDataSource = (data: Person[]) => {
    this.dataSource = new MatTableDataSource(data);
  }

  onClick = (person: Person) => {
    this.router.navigate(['/admin/profile/' + person.id], { state: { person } });
  }

}
