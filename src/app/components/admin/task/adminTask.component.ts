import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin.service';
import { TaskService } from '@services/task/task.service';
import { LanguageService } from '@services/language/language.service';
import { DialogService } from '@services/dialog/dialog.service';

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
  hasChanges = false;

  constructor(
    adminService: AdminService,
    private taskService: TaskService,
    private languageService: LanguageService,
    private dialogService: DialogService,
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
    if (!this.hasChanges || this.getConfirmation()) {
      for (const language of this.allLanguages) {
        if (language.id === languageId) {
          this.selectedLanguage = language;
          this.selectedTask = undefined;
          break;
        }
      }
    }
  }

  selectTask = (taskId: number): void => {
    if (!this.hasChanges || this.getConfirmation()) {
      for (const task of this.allTasks) {
        if (task.id === taskId) {
          this.selectedTask = task;
          this.setKeys();
          break;
        }
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
    if (!this.hasChanges || this.getConfirmation()) {
      this.selectedKey = key;
      this.inputText = this.transformString(this.selectedTask[key]);
    }
  }

  saveTask = () => {
    if (this.hasChanges) { return; }
    this.selectedTask[this.selectedKey] = this.inputText;
    this.taskService.saveTask(this.selectedTask).subscribe(task => {
      this.selectedTask = task;
    });
    this.hasChanges = false;
  }

  canDeactivate = (): Promise<boolean> | boolean => {
    if (!this.hasChanges) {
      return true;
    }
    return this.getConfirmation();
  }

  getConfirmation = () => {
    return this.dialogService.openOkCancel({
      title: 'Are you sure?',
      messages: ['There are unsaved changes, navigating will discard them.']
    });
  }

}
