import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';

import { AceEditorComponent } from 'ng2-ace-editor';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SubmissionService } from '@services/submission/submission.service';
import { TaskService } from '@services/task/task.service';
import { LanguageService } from '@services/language/language.service';
import { TokenStorageService } from '@services/token/token-storage.service';
import { OverlayService } from '@services/overlay/overlay.service';

import { SubscribeComponent } from '@components/overlay/subscribe/subscribe.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('editor') editor: AceEditorComponent;

  selectedLanguage: ILanguage;
  codeSnippet = '';
  evaluationResult: boolean;

  text: string;

  taskSubscription: Subscription;
  languageSubscription: Subscription;
  tests: boolean[] = [false, false, false, false, false];
  subscribeComponent = SubscribeComponent;

  taskSpecificDescription: string;
  taskDescriptionOne: string;
  taskDescriptionTwo: string;
  submissionSubscription: Subscription;
  task: ITask;
  candidate: ICandidate;
  
  outputLines: string[];

  constructor(
    private router: Router,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService,

  ) { }

  ngOnInit() {
    this.retrieveAndSetTask();
    this.retrieveAndSetLanguage();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

  onChange = (event: any) => this.codeSnippet = event;

  evaluateCode = async () => {
    const runCodeSubmission: ISubmission = {
      answer: this.codeSnippet,
      languageId: this.selectedLanguage.id,
      taskId: this.task.id,
      correct: [],
      runningTime: 0
    };
    const kernelId = this.tokenStorageService.getKernelId(this.selectedLanguage.language);
    await this.submissionService.runCode(runCodeSubmission, kernelId).toPromise().then(response => {
      this.outputLines = [];
      this.tokenStorageService.setKernelId(response.kernelId, this.selectedLanguage.language);
      response.jupyterResponses.forEach(line => {
        if (line.errorType === null) {
          // For python it returns a single line split with newlines. Other languages get a list of lines.
          line.contentValue.split("\n").forEach(entry => {
            this.outputLines.push(entry);
          })
        } else {
          this.outputLines.push(line.errorType);
          this.outputLines.push(line.errorValue);
        }
      });
    })
      .catch((error) => console.warn(error));
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  }

  submitCode = () => {
    if (!this.checkIsLoggedIn()) {
      this.loginWindow(this.subscribeComponent);
    } else {
      // A Submission on the frontend has no id, correct array and personId.
      // This is because these elements will be determined on the backend.
      const submission: ISubmission = {
        answer: this.codeSnippet,
        languageId: this.selectedLanguage.id,
        taskId: this.task.id,
        correct: [],
        runningTime: 0
      };

      const kernelId = this.tokenStorageService.getKernelId(this.selectedLanguage.language);

      this.submissionService.createSubmission(submission, kernelId).subscribe(
        response => {
          this.outputLines = [];
          this.tokenStorageService.setKernelId(response.kernelId, this.selectedLanguage.language);
          this.tests = response.testResultsTest;
        }
      );
    }
  }

  retrieveAndSetLanguage = (): void => {
    const languageParam = this.route.snapshot.paramMap.get('language');

    this.languageSubscription = this.languageService.getLanguagesMap().subscribe((languagesMap) => {
      this.selectedLanguage = languagesMap.get(languageParam);
      this.setBoilerPlateCode();
    });
  }

  retrieveAndSetTask = (): void => {
    this.taskSubscription = this.route.firstChild.paramMap.pipe(
      switchMap(params => {
        let exerciseId = parseInt(params.get('id'));
        if (isNaN(exerciseId)) {
          exerciseId = 1; // simply assign 1 if there's a problem
        }

        return this.taskService.getTask(exerciseId);
      })
    ).subscribe((task: ITask) => {
      this.task = task;

      this.setBoilerPlateCode();
    });
  }

  setBoilerPlateCode = (): void => {
    let boilerplate = '';

    if (this.selectedLanguage && this.task) {
      // tslint:disable-next-line: quotemark
      const descriptionOne = `${this.task.descriptionOne.replace(/`/g, "''")}`;
      // tslint:disable-next-line: quotemark
      const descriptionTwo = `${this.task.descriptionTwo.replace(/`/g, "''")}`;

      const parsedDescriptionOne = JSON.parse(descriptionOne);
      const parsedDescriptionTwo = JSON.parse(descriptionTwo);

      this.taskDescriptionOne = parsedDescriptionOne;
      this.taskDescriptionTwo = parsedDescriptionTwo;

      if (this.selectedLanguage.language === 'java') {
        boilerplate = this.task.boilerplateJava;

        // tslint:disable-next-line: quotemark
        const object = `${this.task.descriptionJava.replace(/`/g, "''")}`;
        const newObject = JSON.parse(object);

        this.taskSpecificDescription = newObject;
      } else if (this.selectedLanguage.language === 'python') {
        boilerplate = this.task.boilerplatePython;

        // tslint:disable-next-line: quotemark
        const object = `${this.task.descriptionPython.replace(/`/g, "''")}`;
        const newObject = JSON.parse(object);

        this.taskSpecificDescription = newObject;
      } else if (this.selectedLanguage.language === 'javascript') {
        boilerplate = this.task.boilerplateJavascript;

        // tslint:disable-next-line: quotemark
        const object = `${this.task.descriptionJavascript.replace(/`/g, "''")}`;
        const newObject = JSON.parse(object);

        this.taskSpecificDescription = newObject;
      }
    }
    const lines = boilerplate.split('\\n');

    this.text = '\n';
    lines.forEach(line => {
      this.text += line;
      this.text += '\n';
    });
    this.codeSnippet = this.text;
  }

  goToTask = (taskNumber: number) => {
    this.router.navigateByUrl('challenge/' + this.selectedLanguage.language + '/' + taskNumber);
  }

  // Map over this instead of hard coding, this is not readable
  completeTask = (taskNumber): boolean => {
    if (this.task.taskNumber === taskNumber) {
      const checker = arr => arr.every(v => v === true);
      return checker(this.tests);
    } else {
      return false;
    }
  }

  finishedCodeChallenge = () => {
    // TODO: add some functionality if the user has finished the code challenge, like showing score or going to leaderboard or profile.
    console.log('The code challenge is completed');
  }

  // Create a Subject in navigation, then make this component listen to it
  checkIsLoggedIn = (): boolean => this.tokenStorageService.isUserLoggedIn();

}
