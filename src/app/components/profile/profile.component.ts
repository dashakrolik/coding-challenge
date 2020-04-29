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

      console.log("checking submissions");
      submissions.forEach(submission => {
        // For each submission we will check which language it is for and for which task. 
        // We will than count the number of correct tests that submission has. 
        // The highest will count for the score that will be displayed on the screen.
        let amountCorrect = submission.correct.filter(Boolean).length;
        if (submission.languageId === 1) {
          // Java
          if (submission.taskId === 1) {
            // First task Java
            if (amountCorrect > this.JavaTask1Correct) {
              this.JavaTask1Correct = amountCorrect;
            }
          } else if (submission.taskId === 2) {
            // Second task Java
            if (amountCorrect > this.JavaTask2Correct) {
              this.JavaTask2Correct = amountCorrect;
            }
          } else if (submission.taskId === 3) {
            // Third task Java
            if (amountCorrect > this.JavaTask3Correct) {
              this.JavaTask3Correct = amountCorrect;
            }
          }
        } else if (submission.languageId === 2) {
          // Python
          if (submission.taskId === 1) {
            // First task Python
            if (amountCorrect > this.PythonTask1Correct) {
              this.PythonTask1Correct = amountCorrect;
            }
          } else if (submission.taskId === 2) {
            // Second task Python
            if (amountCorrect > this.PythonTask2Correct) {
              this.PythonTask2Correct = amountCorrect;
            }
          } else if (submission.taskId === 3) {
            // Third task Python
            if (amountCorrect > this.PythonTask2Correct) {
              this.PythonTask3Correct = amountCorrect;
            }
          }
        } else if (submission.languageId === 3) {
          // Javascript
          if (submission.taskId === 1) {
            // First task Javascript
            if (amountCorrect > this.JavascriptTask1Correct) {
              this.JavascriptTask1Correct = amountCorrect;
            }
          } else if (submission.taskId === 2) {
            // Second task Javascript
            if (amountCorrect > this.JavascriptTask2Correct) {
              this.JavascriptTask2Correct = amountCorrect;
            }
          } else if (submission.taskId === 3) {
            // Third task Javascript
            if (amountCorrect > this.JavascriptTask3Correct) {
              this.JavascriptTask3Correct = amountCorrect;
            }
          }
        }
      })
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
