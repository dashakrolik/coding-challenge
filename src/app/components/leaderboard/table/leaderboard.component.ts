import { Component, OnInit, ViewChild } from '@angular/core';
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
      state('collapsed', style({
        top: '{{top}}px',
        left: '{{left}}px',
        display: 'block',
      }), { params: { top: 1, left: 1 } }),
      state('large', style({
        top: '{{top}}px',
        display: 'block',
        left: '{{left}}px',
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<IPerson>;

  constructor(
    private personService: PersonService,
    private languageService: LanguageService,
  ) { }

  showCard = (event: MouseEvent, person: IPerson) => {
    this.personOnCard = person;
    console.log(event);
    this.state = this.state === 'collapsed' ? 'large' : 'collapsed';
    this.top = event.y + 10;
    this.left = event.x + 10;
  }

  ngOnInit(): void {
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

  hello = () => {
    this.displayedColumns[1] = this.selectedLanguage + 'Points';
    // this.dataSource.sort.sort(({ id: this.displayedColumns[1], start: 'desc', disableClear: false }));
  }

}
