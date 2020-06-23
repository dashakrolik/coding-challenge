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

  constructor(
    private personService: PersonService,
    private router: Router,
    private languageService: LanguageService,
  ) { }

  displayedColumns = ['firstName', 'displayedPoints'];
  dataSource: MatTableDataSource<IPersonInTable>;
  state: string;
  allLanguages: ILanguage[];
  selectedLanguage: string;
  top: number;
  left: number;
  personOnCard: IPerson;
  persons: IPerson[];

  @ViewChild(MatTable) table: MatTable<IPerson>;
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (this.dataSource) { this.dataSource.paginator = paginator; }
  }
  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (this.dataSource) { this.dataSource.sort = sort; }
    console.log(this.dataSource);
  }

  ngOnInit(): void {
    this.personService.getAllPersons().pipe(take(1)).subscribe(persons => {
      this.persons = persons;
    });
    this.languageService.getLanguages().pipe(take(1)).subscribe(languages => {
      this.allLanguages = languages;
    });
  }

  showCard = (event: MouseEvent, person: IPerson) => {
    this.personOnCard = person;
    this.top = event.y + 10;
    this.left = event.x + 10;
  }

  setDataSource(data: IPersonInTable[]) {
    this.dataSource = new MatTableDataSource(data);
  }

  selectLanguage = () => {
    const languageIndex = this.findLanguageIndex();
    this.persons.forEach(person => {
      (person as IPersonInTable).displayedPoints = person.points[languageIndex];
    });
    this.dataSource = new MatTableDataSource(this.persons as IPersonInTable[]);
  }

  findLanguageIndex = () => {
    if (this.selectedLanguage.toLowerCase() === 'java') {
      return 0;
    } else if (this.selectedLanguage.toLowerCase() === 'python') {
      return 1;
    } else if (this.selectedLanguage.toLowerCase() === 'javascript') {
      return 2;
    } else if (this.selectedLanguage.toLowerCase() === 'scala') {
      return 3;
    } else if (this.selectedLanguage.toLowerCase() === 'csharp') {
      return 4;
    }
  }

  goHome = (): Promise<boolean> => this.router.navigate(['/']);
}
