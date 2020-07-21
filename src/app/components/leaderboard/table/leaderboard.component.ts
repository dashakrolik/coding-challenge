import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

import { PersonService } from '@services/person/person.service';
import { LanguageService } from '@services/language/language.service';

export interface tableElement {
  name: string;
  points: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  animations: [
    trigger('trigger', [
      state('*', style({
        top: '{{top}}px',
        left: '{{left}}px',
        display: 'block',
      }), { params: { top: 1, left: 1 } }),
      transition('* <=> *', animate('250ms'))
    ])
  ]
})

export class LeaderboardComponent implements OnInit {

  languageNames$: Observable<string[]>;

  // This is what will be shown in the table.
  TABLE_DATA: tableElement[] = []

  displayedColumns = ['name', 'points'];
  dataSource: MatTableDataSource<tableElement>;
  state: string;
  selectedLanguage: string;
  top: number;
  left: number;
  personOnCard: IPerson;
  languageIndex: number;
  allPeople: {name: string, points: number[]}[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<IPerson>;

  constructor(
    private personService: PersonService,
    private router: Router,
    private languageService: LanguageService,
  ) { }

  showCard = (event: MouseEvent, person: IPerson) => {
    this.personOnCard = person;
    this.top = event.y + 10;
    this.left = event.x + 10;
  }

  ngOnInit(): void {
    this.languageIndex = 0;
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      persons.forEach(person => {
        this.allPeople.push({name: person.firstName + " " + person.lastName, points: person.points});
      })
    });

    // get just the names of the languages
    this.languageNames$ = this.languageService.getLanguages().pipe(
      map(languages =>
        languages.map(lang => lang.language)
      )
    );

    this.dataSource = new MatTableDataSource(this.TABLE_DATA);
    this.dataSource.sort = this.sort;
  }

  onSelect = (event: MatSelectChange) => {
    // TODO: Add correct behaviour.
    this.selectedLanguage = event.value;
    this.TABLE_DATA = []
    var tableIndex = 0;
    if (this.selectedLanguage === 'java') {
      tableIndex = 0;
    } else if (this.selectedLanguage === 'python') {
      tableIndex = 1;
    } else if (this.selectedLanguage === 'javascript') {
      tableIndex = 2;
    } else if (this.selectedLanguage === 'scala') {
      tableIndex = 3;
    } else if (this.selectedLanguage === 'csharp') {
      tableIndex = 4;
      // We also set the selected language to be 'C#' This is so that is shows up correctly on the page.
      this.selectedLanguage = 'C#';
    }

    // We fill the table with the correct data
    this.allPeople.forEach(person => {
      const element: tableElement = {name: person.name, points: person.points[tableIndex]};
      this.TABLE_DATA.push(element)
    })
    
    this.dataSource = new MatTableDataSource(this.TABLE_DATA);
    this.dataSource.sort = this.sort;

    // We set the sorting of the table to be on the points. The highest points will be on the top
    const sortState: Sort = {active: 'points', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  goHome = (): Promise<boolean> => this.router.navigate(['/']);
}
