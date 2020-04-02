import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/types/Person.d';
import { PersonService } from 'src/app/service/person/person.service';
import { SubmissionService } from 'src/app/service/submission/submission.service';
import { Submission } from '../../../types/Submission.d';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  person: Person;
  submissions: Submission[];
  personDetailsForm;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private submissionsService: SubmissionService,
    private formBuilder: FormBuilder
  ) {
    this.personDetailsForm = this.formBuilder.group({
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      role: ''
    });
  }

  ngOnInit(): void {
    let personId: number;
    this.route.params.subscribe(event => {
      personId = event.id;
    });
    if (history.state.person === undefined) {
      this.personService.getPersonById(personId).subscribe(person => {
        this.person = person;
      });
    } else {
      this.person = history.state.person;
    }
    this.submissionsService.getAllSubmissionsFromPerson(personId).subscribe(submissions => {
      this.submissions = submissions;
    });
    this.personDetailsForm.id = this.person.id;
    this.personDetailsForm.firstName = this.person.firstName;
    this.personDetailsForm.lastName = this.person.lastName;
    this.personDetailsForm.email = this.person.email;
    this.personDetailsForm.role = this.person.role;
  }

  onSubmit = (personData): void => {
    console.log(personData);
  }

  onClick() {
    console.log('click');
  }
}
