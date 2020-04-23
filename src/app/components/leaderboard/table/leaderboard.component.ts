import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PersonService } from '@service/person/person.service';
import { take } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  animations: [
    trigger('trigger', [
      state('collapsed', style({
        top: '{{top}}px',
        left: '{{left}}px',
      }), { params: { top: 1, left: 1 } }),
      state('large', style({
        top: '{{top}}px',
        left: '{{left}}px',
      }), { params: { top: 1, left: 1 } }),
      transition('collapsed <=> large', animate('500ms'))
    ])
  ]
})
export class LeaderboardComponent implements OnInit {

  constructor(
    private personService: PersonService,
  ) { }
  displayedColumns = ['firstName', 'points'];
  dataSource: MatTableDataSource<Person>;
  state: string;
  top: number;
  left: number;
  personOnCard: Person;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Person>;

  showCard = (event: MouseEvent, person: Person) => {
    this.personOnCard = person;
    console.log(event);
    this.state = this.state === 'collapsed' ? 'large' : 'collapsed';
    this.top = event.y + 10;
    this.left = event.x + 10;
  }

  ngOnInit(): void {
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      this.setDataSource(persons);
      // Voor zodat er iets te laten zien is.
      persons.forEach(person => {
        person.points = Math.round(Math.random() * 5000);
      });
      this.sort.sort(({ id: 'points', start: 'desc', disableClear: false }));
      this.dataSource.sort = this.sort;
    });
  }
  setDataSource(data: Person[]) {
    this.dataSource = new MatTableDataSource(data);
  }


}
