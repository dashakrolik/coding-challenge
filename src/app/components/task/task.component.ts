import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AceEditorComponent } from 'ng2-ace-editor';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { CandidateService } from '@services/candidate/candidate.service';
import { LanguageService } from '@services/language/language.service';
import { SubmissionService } from '@services/submission/submission.service';
import { TaskService } from '@services/task/task.service';
import { TokenStorageService } from '@services/token/token-storage.service';

import { SubmitDialogComponent } from '@components/submit-dialog/submit-dialog.component';

// TODO: There are A LOT of things going on here (too many for just one component)
// We need to split this up thats one
// Two, a lot of this code is not necessary, let's refactor

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('editor') editor: AceEditorComponent;

  selectedLanguage: ILanguage;
  codeSnippet = '';
  evaluationResult: boolean;

  editorText: string;

  taskSubscription: Subscription;
  languageSubscription: Subscription;
  submissionSubscription: Subscription;
  task: ITask;
  candidate: ICandidate;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.retrieveAndSetLanguage();
    this.retrieveAndSetTask();
  }

  ngAfterViewInit() {
    // TODO check if necessary
    // this.editor.setOptions({
    //   animatedScroll: true,
    //   showPrintMargin: false,
    //   tabSize: 2,
    //   useSoftTabs: true,
    // });
  }

  onChange = (event: any) => this.codeSnippet = event;

  evaluateCode = (): boolean => {
    // TODO: Implement Jupyter connection
    // use this.selectedLanguage

    return this.evaluationResult = true;
  }

  // TODO implement this functionality
  submitCode = () => {
    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      // width: '250px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      console.log('The dialog was closed');
      console.log('submitCode subscription', result);
    });
  }

  // TODO align this with the dialog service created by Richard
  // TODO also, this doesn't belong in this component
  openLoginModal = () => {
    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      // width: '250px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      const { data } = result;

      // simple check to see if the user cancelled the form and code is evaluated
      if (data != null && this.evaluationResult) {
        // We will create a submission. To do this we must first create the new candidate and retrieve other data
        // Create a new candidate, for now it has a placeholder for first name and last name.
        // Id should be null. It will create an id automatically in the backend if it is null.
        // TODO: instead of creating it and retrieving it we want to add a user login possibility
        // TODO: Now we retrieve the task and the language. Later this should be retrieved already,
        //  remove this at that point.

        const candidate: ICandidate = {
          id: null,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };

        this.candidateService.createCandidate(candidate)
          .pipe(take(1))
          .subscribe((candi) => {
            this.candidate = candi;
          });
      } else {
        console.log('Check fields and code');
      }
    });
  }

  retrieveAndSetLanguage = (): void => {
    const languageParam = this.route.snapshot.paramMap.get('language');

    this.languageSubscription = this.languageService.getLanguagesMap().subscribe((languagesMap) => {
      this.selectedLanguage = languagesMap.get(languageParam);

      if (!this.selectedLanguage) {
        throw new Error(`No such language: ${languageParam}.`);
      }
    });
  }

  retrieveAndSetTask = (): void => {
    this.taskSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        let exerciseId = parseInt(params.get('id'));
        if (isNaN(exerciseId)) {
          exerciseId = 1; // simply assign 1 if there's a problem
        }

        // get the task with this id and switch to that Observable
        return this.taskService.getTask(exerciseId);
      })
    ).subscribe(task => this.task = task);
  }

  createSubmission = (): void => {
    // When creating a new Submission we give id null so it creates a new entry. It will determine the id by itself.
    const submission: ISubmission = {
      id: null,
      answer: this.codeSnippet,
      correct: false,
      personId: this.candidate.id,
      languageId: this.selectedLanguage.id,
      taskId: this.task.id
    };

    this.submissionSubscription = this.submissionService.createSubmission(submission).subscribe(
      response => {
        // TODO: do something with a successful response
        console.log('successful post message create submission');
      }
    );
  }

  checkIsLoggedIn = (): boolean => this.tokenStorageService.isUserLoggedIn();

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
    this.submissionSubscription.unsubscribe();
  }

}
