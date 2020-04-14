import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '@service/person/person.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  person: Person;
  personDetailsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    const id = parseInt(this.route.snapshot.params.id);
    this.personService.getPersonById(id).pipe(take(1)).subscribe(person => {
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
    this.personDetailsForm.patchValue({ ...this.person });
    this.personDetailsForm.get('password').setValue('');
  }

  savePerson = (personData): void => {
    this.personService.updatePerson(personData.value).pipe(take(1)).subscribe(savedPerson => {
      this.person = savedPerson;
    });
  }

  deletePerson = (): void => {
    this.personService.deletePerson(this.person.id).pipe(take(1)).subscribe(() => {
      this.navigateToAdminPanel();
    });
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

}

