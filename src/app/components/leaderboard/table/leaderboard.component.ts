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
  languageMap;
  tableIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<IPerson>;

  constructor(
    private personService: PersonService,
    private router: Router,
    private languageService: LanguageService,
    private dialogService: DialogService,
  ) {
    this.languageMap = new Map();

    this.languageMap.set('java', [this.tableIndex = 0, this.selectedLanguage = 'Java']);
    this.languageMap.set('python', [this.tableIndex = 1, this.selectedLanguage = 'Python']);
    this.languageMap.set('javascript', [this.tableIndex = 2, this.selectedLanguage = 'JavaScript']);
    this.languageMap.set('scala', [this.tableIndex = 3, this.selectedLanguage = 'Scala']);
    this.languageMap.set('csharp', [this.tableIndex = 4, this.selectedLanguage = 'C#']);
    this.selectedLanguage = '';
  }

  showCard = (event: MouseEvent, tableElement: ITableElement) => {
    this.personOnCard = this.allPersons.filter(person => tableElement.id === person.id)[0];
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
    this.TABLE_DATA = [];

    this.selectedLanguage = event.value;
    this.tableIndex = this.languageMap.get(this.selectedLanguage)[0];
    this.selectedLanguage = this.languageMap.get(this.selectedLanguage)[1];

    // We fill the table with the correct data
    this.allPeople.forEach(person => {
      const element: ITableElement = {id: person.id, name: person.name, points: person.points[this.tableIndex]};
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
