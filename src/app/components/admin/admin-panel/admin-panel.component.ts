import { Component, OnInit } from '@angular/core';
import { TaskService } from '@service/task/task.service';
import { PersonService } from '@service/person/person.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {
  tasks: Task[];
  persons: Person[];

  constructor(
    private taskService: TaskService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.personService.getAllPersons().subscribe(persons => this.persons = persons);
  }

}

