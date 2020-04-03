import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '@service/person/person.service';
import { SubmissionService } from '@service/submission/submission.service';
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
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.personDetailsForm = this.formBuilder.group({
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      password: ''
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
        this.setFormDetails();
      });
    } else {
      this.person = history.state.person;
      this.setFormDetails();
    }
    this.submissionsService.getAllSubmissionsFromPerson(personId).subscribe(submissions => {
      this.submissions = submissions;
    });
  }

  onSubmit = (personData): void => {
    this.personService.updatePerson(personData.value).subscribe(savedPerson => {
      this.person = savedPerson;
      this.setFormDetails();
    });
  }

  deletePerson = (): void => {
    this.personService.deletePerson(this.person.id).subscribe(() => {
      this.router.navigate(['/admin']);
    });
  }

  setFormDetails = (): void => {
    this.personDetailsForm.get('id').value = this.person.id;
    this.personDetailsForm.get('firstName').value = this.person.firstName;
    this.personDetailsForm.get('lastName').value = this.person.lastName;
    this.personDetailsForm.get('email').value = this.person.email;
    this.personDetailsForm.get('role').value = this.person.role;
    this.personDetailsForm.get('password').value = this.person.password;
  }

  toAdminPanel = () => this.router.navigate(['/admin']);
}
