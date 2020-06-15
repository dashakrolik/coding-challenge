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
  loading = false;
  loadingSubmit = false;

  selectedLanguage: ILanguage;
  submissionSubscription: Subscription;
  task: ITask;
  candidate: ICandidate;
  taskSubscription: Subscription;
  languageSubscription: Subscription;

  codeSnippet = '';
  evaluationResult: boolean;
  showNextTaskButton = false;
  text: string;
  codeResult: any;
  // tests: boolean[] = [true, true, true, true, true];
  tests: boolean[] = [false, false, false, false, false];

  subscribeComponent = SubscribeComponent;
  taskSpecificDescription: string;
  taskDescriptionOne: string;
  taskDescriptionTwo: string;

  output: any;

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
    this.loading = true;
    // Fill the 'codeResult' in the 'evaluateCode' function.
    const runCodeSubmission: ISubmission = {
      answer: this.codeSnippet,
      languageId: this.selectedLanguage.id,
      taskId: this.task.id,
      correct: [],
      runningTime: 0
    };
    const kernelId = this.tokenStorageService.getKernelId(this.selectedLanguage.language);
    await this.submissionService.runCode(runCodeSubmission, kernelId).toPromise().then(response => {
      this.codeResult = '';
      this.tokenStorageService.setKernelId(response.kernelId, this.selectedLanguage.language);
      response.jupyterResponses.forEach(line => {
        if (line.errorType === null) {
          this.codeResult += line.contentValue;
        } else {
          this.codeResult += line.errorType;
          this.codeResult += '\n';
          this.codeResult += line.errorValue;
        }
      });
    })
      .catch((error) => console.warn(error))
      .finally(() => this.loading = false);
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  }

  submitCode = (): void => {
    this.loadingSubmit = true;
    if (!this.checkIsLoggedIn()) {
      this.loginWindow(this.subscribeComponent);
    } else {
      // A Submission on the frontend has no id, correct array and personId.
      // This is because these elements will be determined on the backend.
      const submission: ISubmission = {
        answer: this.codeSnippet,
        languageId: this.selectedLanguage.id,
        taskId: this.task.id,
        // we should not have to send the folowing two lines to the backend then
        correct: [],
        runningTime: 0
      };
      const kernelId = this.tokenStorageService.getKernelId(this.selectedLanguage.language);
      this.submissionService.createSubmission(submission, this.selectedLanguage.language).subscribe(
        response => {
          this.codeResult = '';
          this.tokenStorageService.setKernelId(response.kernelId, this.selectedLanguage.language);
          this.tests = response.testResultsTest;
          this.loadingSubmit = false;
          this.tests.every(test => test === true ? this.showNextTaskButton = true : null);
        },
        error => {
          this.loadingSubmit = false;
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
      } else if (this.selectedLanguage.language === 'scala') {
        boilerplate = this.task.boilerplateScala;

        // tslint:disable-next-line: quotemark
        const object = `${this.task.descriptionScala.replace(/`/g, "''")}`;
        const newObject = JSON.parse(object);

        this.taskSpecificDescription = newObject;
      } else if (this.selectedLanguage.language === 'csharp') {
        boilerplate = this.task.boilerplateCSharp;

        // tslint:disable-next-line: quotemark
        const object = `${this.task.descriptionCSharp.replace(/`/g, "''")}`;
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

  goToTask = () => {
    const taskNumber = parseInt(this.route.firstChild.snapshot.params.id) + 1;
    this.router.navigateByUrl('challenge/' + this.selectedLanguage.language + '/' + taskNumber);
  }
  // Map over this instead of hard coding, this is not readable
  completeTask = (): boolean => this.tests.every(test => test === true ? this.showNextTaskButton = true : null);

  // Create a Subject in navigation, then make this component listen to it
  checkIsLoggedIn = (): boolean => this.tokenStorageService.isUserLoggedIn();
}
