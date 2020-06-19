import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

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

  displayedColumns = ['firstName', 'points'];
  dataSource: MatTableDataSource<IPerson>;
  state: string;
  allLanguages: ILanguage[];
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
    this.languageService.getLanguages().pipe(take(1)).subscribe(languages => {
      this.allLanguages = languages;
    });
  }

  setDataSource(data: IPerson[]) {
    this.dataSource = new MatTableDataSource(data);
  }

  selectLanguage = () => {
    if (this.selectedLanguage.toLowerCase() === 'java') {
      this.languageIndex = 0;
    } else if (this.selectedLanguage.toLowerCase() === 'python') {
      this.languageIndex = 1;
    } else if (this.selectedLanguage.toLowerCase() === 'javascript') {
      this.languageIndex = 2;
    }
    this.displayedColumns[1] = this.selectedLanguage + 'Points';
  }

  goHome = (): Promise<boolean> => this.router.navigate(['/']);
}
