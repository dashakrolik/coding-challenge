import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

import { PersonService } from '@services/person/person.service';
import { LanguageService } from '@services/language/language.service';

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

  displayedColumns = ['firstName', 'points'];
  dataSource: MatTableDataSource<IPerson>;
  state: string;
  selectedLanguage: string;
  top: number;
  left: number;
  personOnCard: IPerson;
  languageIndex: number;

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
      this.setDataSource(persons);
      this.dataSource.sort = this.sort;
    });

    // get just the names of the languages
    this.languageNames$ = this.languageService.getLanguages().pipe(
      map(languages =>
        languages.map(lang => lang.language)
      )
    );
  }

  setDataSource(data: IPerson[]) {
    this.dataSource = new MatTableDataSource(data);
  }

  onSelect = (event: MatSelectChange) => {
    // TODO: Add correct behaviour.
    this.selectedLanguage = event.value;
    if (this.selectedLanguage === 'java') {
      this.languageIndex = 0;
      // this.lang = 0;
    } else if (this.selectedLanguage === 'python') {
      this.languageIndex = 1;
      // this.lang = 1;
    } else if (this.selectedLanguage === 'javascript') {
      this.languageIndex = 2;
      // this.lang = 2;
    }  else if (this.selectedLanguage === 'scala') {
      this.languageIndex = 3;
      // this.lang = 3;
    } else if (this.selectedLanguage === 'csharp') {
      this.languageIndex = 4;
      // this.lang = 4;
      // We also set the selected language to be 'C#' This is so that is shows up correctly on the page.
      this.selectedLanguage = 'C#';
    } else {
      // this.lang = null;
    }
    this.displayedColumns[1] = this.selectedLanguage + 'Points';
  }

  goHome = (): Promise<boolean> => this.router.navigate(['/']);
}
