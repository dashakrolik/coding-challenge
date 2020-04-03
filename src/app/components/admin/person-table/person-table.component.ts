import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PersonService } from '@service/person/person.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.css']
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
  displayedColumns = ['id', 'firstName', 'lastName', 'email'];

  ngOnInit() {
    this.personService.getAllPersons().toPromise().then(persons => {
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
