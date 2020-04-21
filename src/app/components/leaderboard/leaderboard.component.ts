import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PersonService } from '@service/person/person.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  displayedColumns = ['firstName', 'points'];
  dataSource: MatTableDataSource<Person>;

  constructor(
    private personService: PersonService,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Person>;

  ngOnInit(): void {
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      this.setDataSource(persons);
      this.dataSource.sort = this.sort;
    });
  }
  setDataSource(data: Person[]) {
    this.dataSource = new MatTableDataSource(data);
  }

}
