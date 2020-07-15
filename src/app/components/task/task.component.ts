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
export class TaskComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editor: AceEditorComponent;
  loading = false;
  loadingSubmit = false;

  selectedLanguage: ILanguage;
  submissionSubscription: Subscription;
  task: ITask;
  candidate: ICandidate;
  taskSubscription: Subscription;
  languageSubscription: Subscription;

  goToFinishTaskComponent = false;
  totalNumberOfTasks: number;
  codeSnippet = '';
  evaluationResult: boolean;
  showNextTaskButton = false;
  text: string;
  codeResult: any;
  tests: boolean[] = [];

  subscribeComponent = SubscribeComponent;
  taskSpecificDescription: string;
  taskDescriptionOne: string;
  taskDescriptionTwo: string;

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
    this.taskService.getTotalNumberOfTasks().subscribe(response => this.totalNumberOfTasks = response);

    this.retrieveAndSetTask();
    this.retrieveAndSetLanguage();
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

    await this.submissionService.runCode(runCodeSubmission).toPromise().then(response => {
      this.outputLines = [];
      response.forEach(line => {
        if (line.errorType === null) {
          // For python it returns a single line split with newlines. Other languages get a list of lines.
          line.contentValue.split('\n').forEach(entry => {
            this.outputLines.push(entry);
          });
        } else {
          this.outputLines.push(line.errorType);
          this.outputLines.push(line.errorValue);
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
        // we should not have to send the following two lines to the backend then
        correct: [],
        runningTime: 0
      };

      this.submissionService.createSubmission(submission).subscribe(
        response => {
          this.codeResult = '';
          this.tests = response;
          this.loadingSubmit = false;
          if (!(this.task.id === this.totalNumberOfTasks)) {
            this.tests.every(test => test === true ? this.showNextTaskButton = true : null);
          } else {
            this.tests.every(test => test === true ? this.goToFinishTaskComponent = true : null);
          }
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
      this.tests = task.defaultTestsArray;
      this.setBoilerPlateCode();
    });
  }

  setBoilerPlateCode = (): void => {
    let boilerplate = '';
    if (this.selectedLanguage && this.task) {

      this.taskDescriptionOne = this.parseCode(this.task.descriptionOne);
      this.taskDescriptionTwo = this.parseCode(this.task.descriptionTwo);
      boilerplate = this.task.boilerplateJava;
      this.taskSpecificDescription = this.parseCode(this.task['description' + this.selectedLanguage.language]);

    }

    const lines = boilerplate.split('\\n');
    this.text = '\n';
    lines.forEach(line => {
      this.text += line;
      this.text += '\n';
    });
    this.codeSnippet = this.text;
  }

  // tslint:disable-next-line: quotemark
  parseCode = (stringToParse: string) => JSON.parse(`${stringToParse.replace(/`/g, "''")}`);


  goToTask = () => {
    const taskNumber = parseInt(this.route.firstChild.snapshot.params.id) + 1;
    this.router.navigateByUrl('challenge/' + this.selectedLanguage.language + '/' + taskNumber);
  }

  goToLeaderboard = () => {
    this.router.navigateByUrl('leaderboard');
  }

  // Map over this instead of hard coding, this is not readable
  // tslint:disable-next-line: max-line-length
  completeTask = (): boolean => this.tests.every(test => (test === true && this.task.id !== this.totalNumberOfTasks) ? this.showNextTaskButton = true : null);
  // tslint:disable-next-line: max-line-length
  redirectToFinish = () => this.tests.every(test => (test === true && this.task.id === this.totalNumberOfTasks) ? this.goToFinishTaskComponent = true : null);

  // Create a Subject in navigation, then make this component listen to it
  checkIsLoggedIn = (): boolean => this.tokenStorageService.isUserLoggedIn();
}
