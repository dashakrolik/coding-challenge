import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '@services/token/token-storage.service';
import { LanguageService } from '@services/language/language.service';
import { MatSelectChange } from '@angular/material/select';
import { SubmissionService } from '@services/submission/submission.service';
import { PersonService } from '@services/person/person.service';

import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  content = '';

  selectedLanguage: string;
  languageNames$: Observable<string[]>;

  // Initialize the test scores to zero. For 3 languages we initialize 3 tasks to 0
  tasksCorrect = [] = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
  lang: number;

  scoreJava: number;
  scorePython: number;
  scoreJavascript: number;
  scoreScala: number;
  scoreCSharp: number;
  pointsTasks: number[][] = [[], [], [], [], []];
  // the amount of tests that each task has.
  taskTests: number[] = [5, 6, 8];
  isAdmin = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {

    this.submissionService.getAllSubmissionsProfile().pipe(take(1)).subscribe(submissions => {

      submissions.forEach(submission => {
        // For each submission we will check which language it is for and for which task.
        // We will than count the number of correct tests that submission has.
        // The highest will count for the score that will be displayed on the screen.
        const amountCorrect = submission.correct.filter(Boolean).length;
        for (var languageNumber = 1; languageNumber <= 3; languageNumber++) {
          for (var taskNumber = 1; taskNumber <= 3; taskNumber++) {
            if (submission.languageId === languageNumber) {
              if (submission.taskId === taskNumber) {
                if (amountCorrect > this.tasksCorrect[languageNumber - 1][taskNumber - 1]) {
                  this.tasksCorrect[languageNumber - 1][taskNumber - 1] = amountCorrect;
                }
              }
            }
          }
        }
      });
    });

    this.personService.getPersonPoints().pipe(take(1)).subscribe(person => {
      person.roles.forEach(role => {
        if (role.name === 'ROLE_ADMIN' || role.name === 'ROLE_MODERATOR') {
          this.isAdmin = true;
        }
      });
      this.pointsTasks = person.pointsTasks;
      this.scoreJava = person.points[0];
      this.scorePython = person.points[1];
      this.scoreJavascript = person.points[2];
      this.scoreScala = person.points[3];
      this.scoreCSharp = person.points[4];
    });

    // TODO: get the score of the languages from the person table

    // get just the names of the languages
    this.languageNames$ = this.languageService.getLanguages().pipe(
      map(languages =>
        languages.map(lang => lang.language)
      )
    );

    if (this.tokenStorageService.isUserLoggedIn()) {
      const user = this.tokenStorageService.getUser();
      const roles = user.roles;
      if (user.firstname == null && user.lastname == null) {
        this.content = 'Hello ' + user.username + '.';
      } else {
        this.content = 'Hello ' + user.firstname + ' ' + user.lastname + '.';
      }
      this.content += ' Select your language and check your progress. The higher the score the better';
    } else {
      this.content = 'nobody is logged in, please log in or create an account';
    }
  }

  onSelect = (event: MatSelectChange) => {
    this.selectedLanguage = event.value;
    if (this.selectedLanguage === 'java') {
      this.lang = 0;
    } else if (this.selectedLanguage === 'python') {
      this.lang = 1;
    } else if (this.selectedLanguage === 'javascript') {
      this.lang = 2;
    }  else if (this.selectedLanguage === 'scala') {
      this.lang = 3;
    } else if (this.selectedLanguage === 'csharp') {
      this.lang = 4;
      // We also set the selected language to be 'C#' This is so that is shows up correctly on the page.
      this.selectedLanguage = 'C#';
    } else {
      this.lang = null;
    }
  }

  goHome = (): Promise<boolean> => this.router.navigate(['/']);

  goToTask = (taskNumber: number): Promise<boolean> => {
    const num = taskNumber + 1;
    if (this.selectedLanguage === 'C#') {
      return this.router.navigate(['challenge/csharp/' + num]);
    } else {
      return this.router.navigate(['challenge/' + this.selectedLanguage + '/' + num]);
    }
  }

  goAdmin = (): Promise<boolean> => this.router.navigate(['/admin']);
}
