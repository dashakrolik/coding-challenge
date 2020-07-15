import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin.service';
import { TaskService } from '@services/task/task.service';
import { LanguageService } from '@services/language/language.service';

@Component({
  selector: 'app-admin-task',
  templateUrl: './adminTask.component.html',
  styleUrls: ['./adminTask.component.scss']
})
export class AdminTaskComponent implements OnInit {
  allTasks: ITask[];
  selectedTask: ITask;
  allLanguages: ILanguage[];
  selectedLanguage: ILanguage;
  inputText: string;
  selectedKey: string;
  keys: string[];

  constructor(
    adminService: AdminService,
    private taskService: TaskService,
    private languageService: LanguageService,
  ) {
    adminService.activeComponent.next('tasks');
  }

  ngOnInit() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.allTasks = tasks;
    });
    this.languageService.getLanguages().subscribe(languages => {
      this.allLanguages = languages;
    });
  }

  selectLanguage = (languageId: number): void => {
    for (const language of this.allLanguages) {
      if (language.id === languageId) {
        this.selectedLanguage = language;
        this.selectedTask = undefined;
        break;
      }
    }
  }
  selectTask = (taskId: number): void => {
    for (const task of this.allTasks) {
      if (task.id === taskId) {
        this.selectedTask = task;
        this.setKeys();
        break;
      }
    }
  }

  setKeys = (): void => {
    this.keys = Object.keys(this.selectedTask).filter(key => {
      return typeof this.selectedTask[key] === 'string';
    });
  }

  transformString = (inputString: string): string => {
    if (this.selectedKey.slice(0, 11) === 'description') {
    }
    return inputString.replace(/\\n/g, '\n');
  }

  // tslint:disable-next-line: quotemark
  parseCode = (stringToParse: string) => JSON.parse(`${stringToParse.replace(/`/g, '\'\'')}`);

  countLines = (): number => {
    return this.inputText.split('\n').length + 3;
  }

  getClass = (buttonName: string): string => {
    if (buttonName === this.selectedLanguage?.language || buttonName === this.selectedTask?.taskNumber.toString()) {
      return 'selected button';
    } else {
      return 'button';
    }
  }

  selectKey = (key: string) => {
    this.selectedKey = key;
    this.inputText = this.transformString(this.selectedTask[key]);
  }

}
