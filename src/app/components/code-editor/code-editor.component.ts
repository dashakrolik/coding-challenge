import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { AceEditorComponent } from 'ng2-ace-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscribeComponent } from '../overlay/subscribe/subscribe.component';
import { CandidateService } from '@service/candidate/candidate.service';
import { TaskService } from '@service/task/task.service';
import { SubmissionService } from '@service/submission/submission.service';
import { LanguageService } from '@service/language/language.service';
import { OverlayService } from '@service/overlay/overlay.service';
import { TokenStorageService } from '@service/token/token-storage.service';
import { Subscription } from 'rxjs';
// @TODO: There are A LOT of things going on here (too many for just one component)
// We need to split this up thats one
// Two, a lot of this code is not necessary, let's refactor

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent implements OnInit, OnDestroy {
  public constructor(
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private submissionService: SubmissionService,
    private tokenStorageService: TokenStorageService
  ) {
    this.route = route;
  }

  @ViewChild('editor') editor: AceEditorComponent;

  selectedLanguage: string;
  exerciseId: number;
  codeSnippet = '';
  selectedLanguageIsJavascript: boolean;
  selectedLanguageIsPython: boolean;
  selectedLanguageIsJava: boolean;
  evaluationResult: boolean;
  loadJavaScriptTask: any;

  // These variables are used to create the submission object
  submissionLanguageId: number;
  submissionTaskId: number;
  submission: Submission;

  taskDescription: string;
  subscribeComponent = SubscribeComponent;
  text = '';
  language = this.selectedLanguage;

  paramSubscription: Subscription;
  codeResult: String
  tests: boolean[]

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = params.get('language');
    });
    this.route.firstChild.paramMap.subscribe(params => {
      this.exerciseId = parseInt(params.get("id"));
    })

    this.selectedLanguageIsJavascript = this.selectedLanguage === 'javascript';
    this.selectedLanguageIsPython = this.selectedLanguage === 'python';
    this.selectedLanguageIsJava = this.selectedLanguage === 'java';
    this.loadJavaScriptTask = this.selectedLanguageIsJavascript;
    this.codeResult = '';
    // Give a initial text in the code editor for the user to modify.
    this.text = 'def calculate_highest_frequency(ordina_input):\n	"""calculate_highest_frequency should return the highest frequency in the text (several words might actually have this frequency)"""\n    # finish the function logic\n	return 0\n\nif __name__ == "__main__":\n    ordina_input = "This is the input"\n    result = calculate_highest_frequency(ordina_input)\n    print(result)';
    this.tests = [false, false, false, false, false, false, false, false, false, false, false];
    // We load the task based on the exerciseId
    this.getTask();
    this.getLanguage();
  }

  ngAftterViewInit() {
    this.editor.setOptions({
      animatedScroll: true,
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
    });
  }

  onChange = (event: any) => this.codeSnippet = event;

  // @TODO refactor the code below
  setLanguageOptions = (option: string): string => {
    const isJavascriptMode = option === 'mode' && this.selectedLanguageIsJavascript;
    const isPythonMode = option === 'mode' && this.selectedLanguageIsPython;
    const isJavaMode = option === 'mode' && this.selectedLanguageIsJava;
    const isJavascriptTheme = option === 'theme' && this.selectedLanguageIsJavascript;
    const isPythonTheme = option === 'theme' && this.selectedLanguageIsPython;
    const isJavaTheme = option === 'theme' && this.selectedLanguageIsJava;

    switch (true) {
      case (isJavascriptMode):
        return 'javascript';
      case (isPythonMode):
        return 'python';
      case (isJavaMode):
        return 'java';
      case (isJavascriptTheme):
        return 'dracula';
      case (isPythonTheme):
        return 'monokai';
      case (isJavaTheme):
        return 'eclipse';
    }
  }

  runCode = (): boolean => {
    switch (true) {
      case this.selectedLanguageIsJavascript:
        return this.evaluateCode('javascript');
      case this.selectedLanguageIsPython:
        return this.evaluateCode('python');
      case this.selectedLanguageIsJava:
        return this.evaluateCode('java');
    }
  }
  
  evaluateCode = (language: string): boolean => {
    const runCodeSubmission: Submission = {
      answer: this.codeSnippet,
      correct: false,
      languageId: this.submissionLanguageId,  
      taskId: this.submissionTaskId
    };
    this.submissionService.runCode(runCodeSubmission).subscribe(
      response => this.handleSuccessfulResponseRunCode(response),
    );

    this.evaluationResult = true;
    return this.evaluationResult;
  }

  handleSuccessfulResponseRunCode = (response): void => {
    // First we clear the current output for the new input
    // TODO: check if there is an error and print that instead of the normal contentvalue.
    this.codeResult = "";
    response.forEach(element => {
      this.codeResult += element.contentValue;
      console.log(element);
    });
  }

  loginWindow(content: ComponentType<SubscribeComponent>) {
    const ref = this.overlayService.open(content, null);
  }

  getTask = (): void => {
    this.taskService.getTask(this.exerciseId).subscribe(
      response => this.handleSuccessfulResponseGetTask(response),
    );
  }

  getLanguage = (): void => {
    this.languageService.getLanguageId(this.selectedLanguage).subscribe(
      response => this.handleSuccessfulResponseGetLanguage(response),
    );
  }

  handleSuccessfulResponseGetLanguage = (response): void => {
    this.submissionLanguageId = response.id;
  }
  
  createSubmission = (): void => {
    this.submission = {
      answer: this.codeSnippet,
      correct: false,
      languageId: this.submissionLanguageId,  
      taskId: this.submissionTaskId
    };

    this.submissionService.createSubmission(this.submission).subscribe(
      response => this.handleSuccessfulResponseCreateSubmission(response),
    );
  }

  handleSuccessfulResponseGetTask = (response): void => {
    // We receive the task object from the backend and we need the id and the description.
    const { id, description } = response;
    this.submissionTaskId = id;
    this.taskDescription = description;
  }

  handleSuccessfulResponseCreateSubmission = (response): void => {
    this.codeResult = "";
    console.log('successful post message create submission');
    let index = 1;
    response.forEach(element => {
      const elementName = 'test' + index;
      let testDot = document.getElementById(elementName);
      if (element) {
        testDot.style.backgroundColor="green"
        this.tests[index] = true;
      } else {
        testDot.style.backgroundColor="red"
        this.tests[index] = false;
      }
      index += 1
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  getTaskDescription = () => this.taskDescription;

  submitCode = (): void => {
    // This code is called when it is confirmed that the user is logged in
    // We should have the language id. quick test to see if a language id is set.
    if (this.submissionLanguageId !== null) {
      this.createSubmission();
    }
  }

  checkLogin = (): boolean => this.tokenStorageService.isUserLoggedIn();

  completeTask = (taskNumber): boolean => {
    // TODO: implement the complete task check
    // Now it just check if the 2 tests I have added are correct. change this with the final test implementation
    let completedTests = 0;
    this.tests.forEach( test => {
      if (test) {
        completedTests += 1
      }
    })
    if (completedTests >= 2) {
      return true;
    } else {
      return false;
    }
  }

  goToTask = (taskNumber) => {
    console.log("going to task number " + taskNumber);
  }
}
