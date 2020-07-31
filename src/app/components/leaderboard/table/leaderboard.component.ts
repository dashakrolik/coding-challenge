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
import { DialogService } from '@services/dialog/dialog.service';

export interface ITableElement {
  id: number;
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
  TABLE_DATA: ITableElement[] = [];

  displayedColumns = ['name', 'points'];
  dataSource: MatTableDataSource<ITableElement>;
  state: string;
  selectedLanguage: string;
  top: number;
  left: number;
  personOnCard: IPerson;
  languageIndex: number;
  allPeople: {id: number, name: string, points: number[]}[] = [];
  allPersons: IPerson[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<IPerson>;

  constructor(
    private personService: PersonService,
    private router: Router,
    private languageService: LanguageService,
    private dialogService: DialogService
  ) { }

  showCard = (event: MouseEvent, tableElement: ITableElement) => {
    this.personOnCard = this.allPersons.filter(person => tableElement.id === person.id)[0];
    this.top = event.y + 10;
    this.left = event.x + 10;
  }

  showCard2 = (event: MouseEvent, tableElement: ITableElement) => {
    this.personOnCard = this.allPersons.filter(person => tableElement.id === person.id)[0]
    this.dialogService.openCard(this.personOnCard);
  }

  ngOnInit(): void {
    this.languageIndex = 0;
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      this.allPersons = persons;
      persons.forEach(person => {
        this.allPeople.push({id: person.id, name: person.firstName + ' ' + person.lastName, points: person.points});
      });
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
    this.selectedLanguage = event.value;
    this.TABLE_DATA = [];
    let tableIndex = 0;
    if (this.selectedLanguage === 'java') {
      this.selectedLanguage = 'Java';
      tableIndex = 0;
    } else if (this.selectedLanguage === 'python') {
      tableIndex = 1;
      this.selectedLanguage = 'Python';
    } else if (this.selectedLanguage === 'javascript') {
      tableIndex = 2;
      this.selectedLanguage = 'JavaScript';
    } else if (this.selectedLanguage === 'scala') {
      tableIndex = 3;
      this.selectedLanguage = 'Scala';
    } else if (this.selectedLanguage === 'csharp') {
      tableIndex = 4;
      this.selectedLanguage = 'C#';
    }

    // We fill the table with the correct data
    this.allPeople.forEach(person => {
      const element: ITableElement = {id: person.id, name: person.name, points: person.points[tableIndex]};
      this.TABLE_DATA.push(element);
    });

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
