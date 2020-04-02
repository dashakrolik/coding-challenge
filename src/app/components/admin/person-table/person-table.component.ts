import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { PersonTableDataSource } from './person-table-datasource';
import { PersonService } from 'src/app/service/person/person.service';
import { Router } from '@angular/router';
import { Person } from 'src/app/types/Person';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.css']
})
export class PersonTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Person>;
  dataSource: PersonTableDataSource;

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'lastName', 'email'];

  ngOnInit() {
    this.dataSource = new PersonTableDataSource();
    this.personService.getAllPersons().subscribe(persons => this.dataSource.data = persons);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onClick = (person: Person) => {
    this.router.navigate(['/admin/profile/' + person.id], { state: { person } });
  }
}
