import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '@services/token/token-storage.service';
import { LanguageService } from '@services/language/language.service';
import { map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { SubmissionService } from '@services/submission/submission.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  content = '';
  
  selectedLanguage: string;
  languageNames$: Observable<string[]>;

  JavaTask1Correct: number;
  JavaTask2Correct: number;
  JavaTask3Correct: number;
  PythonTask1Correct: number;
  PythonTask2Correct: number;
  PythonTask3Correct: number;
  JavascriptTask1Correct: number;
  JavascriptTask2Correct: number;
  JavascriptTask3Correct: number;

  scoreJava: number;
  scorePython: number;
  scoreJavascript: number;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private languageService: LanguageService,
    private submissionService: SubmissionService
  ) { }

  ngOnInit(): void {
    // Initialize the scores to zero
    this.JavaTask1Correct = 0
    this.JavaTask2Correct = 0
    this.JavaTask3Correct = 0
    this.PythonTask1Correct = 0
    this.PythonTask2Correct = 0
    this.PythonTask3Correct = 0
    this.JavascriptTask1Correct = 0
    this.JavascriptTask2Correct = 0
    this.JavascriptTask3Correct = 0
    
    this.scoreJava = 0
    this.scorePython = 0
    this.scoreJavascript = 0

    this.submissionService.getAllSubmissionsProfile().pipe(take(1)).subscribe(submissions => {

      submissions.forEach(submission => {
        // For each submission we will check which language it is for and for which task. 
        // We will than count the number of correct tests that submission has. 
        // The highest will count for the score that will be displayed on the screen.
        if (submission.languageId === 1) {
          // Java
          if (submission.taskId === 1) {
            // First task
          }
        } else if (submission.languageId === 2) {
          if (submission.taskId === 1) {
            // First task Python
            // TODO: store the highest amount of tests succeeded.
            this.PythonTask1Correct = submission.correct.filter(Boolean).length;
          } else if (submission.taskId === 2) {
            // Second task Python
            this.PythonTask2Correct = submission.correct.filter(Boolean).length;
          } else if (submission.taskId === 3) {
            // Third task Python
            this.PythonTask3Correct = submission.correct.filter(Boolean).length;
          }
          // Python
        } else if (submission.languageId === 3) {
          // Javascript
          if (submission.taskId === 1) {
            // First task Python
            this.JavascriptTask1Correct = submission.correct.filter(Boolean).length;
          } else if (submission.taskId === 2) {
            // Second task Python
            this.JavascriptTask2Correct = submission.correct.filter(Boolean).length;
          } else if (submission.taskId === 3) {
            // Third task Python
            this.JavascriptTask3Correct = submission.correct.filter(Boolean).length;
          }
        }
      })
      console.log("checking submissions");
    });
    
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
      this.content += ' Select your language and check your progress';
    } else {
      this.content = 'nobody is logged in, please log in or create an account';
    }
  }

  onSelect = (event: MatSelectChange) => this.selectedLanguage = event.value;

  goHome = (): Promise<boolean> => this.router.navigate(['/']);

  goToTask1Python = (): Promise<boolean> => this.router.navigate(['challenge/python/1']);
  goToTask2Python = (): Promise<boolean> => this.router.navigate(['challenge/python/2']);
  goToTask3Python = (): Promise<boolean> => this.router.navigate(['challenge/python/3']);

  goToTask1Java = (): Promise<boolean> => this.router.navigate(['challenge/java/1']);
  goToTask2Java = (): Promise<boolean> => this.router.navigate(['challenge/java/2']);
  goToTask3Java = (): Promise<boolean> => this.router.navigate(['challenge/java/3']);

  goToTask1Javascript = (): Promise<boolean> => this.router.navigate(['challenge/javascript/1']);
  goToTask2Javascript = (): Promise<boolean> => this.router.navigate(['challenge/javascript/2']);
  goToTask3Javascript = (): Promise<boolean> => this.router.navigate(['challenge/javascript/3']);
}
