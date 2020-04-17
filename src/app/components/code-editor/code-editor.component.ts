import { Component, TemplateRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';

import { AceEditorComponent } from 'ng2-ace-editor';

import { CandidateService } from '@service/candidate/candidate.service';
import { TaskService } from '@service/task/task.service';
import { SubmissionService } from '@service/submission/submission.service';
import { LanguageService } from '@service/language/language.service';
import { OverlayService } from '@service/overlay/overlay.service';

import { Subscription } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SubmitDialogComponent } from '@components/submit-dialog/submit-dialog.component';
import { TokenStorageService } from '@service/token/token-storage.service';
import { take } from 'rxjs/operators';
// @TODO: There are A LOT of things going on here (too many for just one component)
// We need to split this up thats one
// Two, a lot of this code is not necessary, let's refactor

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @ViewChild('editor') editor: AceEditorComponent;
  
  selectedLanguage: string;
  exerciseId: number;
  codeSnippet = '';
  selectedLanguageIsJavascript: boolean;
  selectedLanguageIsPython: boolean;
  selectedLanguageIsJava: boolean;
  evaluationResult: boolean;
  
  // These variables are used to create the submission object
  submissionLanguageId: number;
  submissionCandidateId: number;
  submissionTaskId: number;
  
  taskDescription: string;
  text = '';
  
  paramMapSubscription: Subscription;
  taskSubscription: Subscription;
  languageSubscription: Subscription;
  submissionSubscription: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private candidateService: CandidateService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      this.selectedLanguage = params.get('language') || 'javascript';
      
      this.exerciseId = parseInt(params.get('id'));
      if(isNaN(this.exerciseId)) {
        this.exerciseId = 1; // simply assign  if there's a problem
      }

    });
    
    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';

    // We load the task based on the exerciseId
    this.getTask();
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

  /**
   * Get the mode for the editor to run in
   */
  getMode = (): string => this.selectedLanguage;

  /**
   * Get the theme for the editor to display
   */
  getTheme = (): string => {
    if (this.selectedLanguageIsJavascript) {
      return 'dracula';
    }
    if (this.selectedLanguageIsPython) {
      return 'monokai';
    }
    if (this.selectedLanguageIsJava) {
      return 'eclipse';
    }
  }

  evaluateCode = (): boolean => {
    // TODO: Implement Jupyter connection
    // use this.selectedLanguage

    return this.evaluationResult = true;
  }

  submitCode = () => {
    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      // width: '250px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

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

        const candidate: Candidate = {
          id: null,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };

        this.candidateService.createCandidate(candidate)
          .pipe(take(1))
          .subscribe((candi: Candidate) => {
            this.submissionCandidateId = candi.id;
          });
      } else {
        console.log('Check fields and code');
      }
    });
  }

  openModal = (content: TemplateRef<any> | ComponentType<any> | string): void => {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      // simple check to see if the user cancelled the form and code is evaluated
      if (res.data != null && this.evaluationResult) {
        // We will create a submission. To do this we must first create the new candidate and retrieve other data
        // Create a new candidate, for now it has a placeholder for first name and last name.
        // Id should be null. It will create an id automatically in the backend if it is null.
        // TODO: instead of creating it and retrieving it we want to add a user login possibility
        // TODO: Now we retrieve the task and the language. Later this should be retrieved already,
        //  remove this at that point.

      //   const candidate: Candidate = {
      //     id: null,
      //     firstName: res.data.firstName,
      //     lastName: res.data.lastName,
      //     email: res.data.email
      //   };

      //   this.candidateService.createCandidate(candidate)
      //     .pipe(take(1))
      //     .subscribe(response => {
      //     const { id } = response;
      //     this.submissionCandidateId = id;
      //   });
      // } else {
      //   console.log('Check fields and code');
      }
    });
  }

  getTask = (): void => {
    this.taskSubscription = this.taskService.getTask(this.exerciseId).subscribe(
      (response: any) => {
        //We receive the task object from the backend and we need the id and the description.
        const { id, description } = response;
        this.submissionTaskId = id;
        this.taskDescription = description;
      }
    );
  }

  getLanguage = (): void => {
    this.languageSubscription = this.languageService.getLanguages().subscribe(
      (response: any) => {
        const { id } = response;
        this.submissionLanguageId = id;
        // Finally we want to find the task that candidate has performed to create the final submission to send.
        this.createSubmission();
      },
    );
  }

  createSubmission = (): void => {
    // When creating a new Submission we give id null so it creates a new entry. It will determine the id by itself.
    const submission: Submission = {
      id: null,
      answer: this.codeSnippet,
      correct: false,
      personId: this.submissionCandidateId,
      languageId: this.submissionLanguageId,
      taskId: this.submissionTaskId
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
    this.paramMapSubscription.unsubscribe();
    this.taskSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
    this.submissionSubscription.unsubscribe();
  }

}
