import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '@service/person/person.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  person: Person;
  personDetailsForm: FormGroup;
  getPersonSubscription: Subscription;
  savePersonSubscription: Subscription;
  deletePersonSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    const id = parseInt(this.route.snapshot.params.id);
    this.getPersonSubscription = this.personService.getPersonById(id).subscribe(person => {
      this.person = person;
      this.fillForm();
    });
  }

  createForm = (): void => {
    this.personDetailsForm = this.formBuilder.group({
      id: [{ value: 0, disabled: true }],
      firstName: [''],
      lastName: [''],
      email: [''],
      role: [''],
      password: ['']
    });
  }

  fillForm = (): void => {
    this.personDetailsForm.get('id').setValue(this.person.id);
    this.personDetailsForm.get('firstName').setValue(this.person.firstName);
    this.personDetailsForm.get('lastName').setValue(this.person.lastName);
    this.personDetailsForm.get('email').setValue(this.person.email);
    this.personDetailsForm.get('role').setValue(this.person.role);
  }

  savePerson = (personData): void => {
    this.savePersonSubscription = this.personService.updatePerson(personData.value).subscribe(savedPerson => {
      this.person = savedPerson;
    });
  }

  deletePerson = (): void => {
    this.deletePersonSubscription = this.personService.deletePerson(this.person.id).subscribe(() => {
      this.navigateToAdminPanel();
    });
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

  ngOnDestroy = () => {
    this.getPersonSubscription.unsubscribe();
    this.savePersonSubscription.unsubscribe();
    this.deletePersonSubscription.unsubscribe();
  }
}

