import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '@service/person/person.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  person: Person;
  personDetailsForm: FormGroup;
  // TODO: get roles from backend
  roles: string[] = ['USER', 'ADMIN'];

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

  // TODO: Give a response to the user if save or delete succeeded or failed
  savePerson = (): void => {
    const idControl: AbstractControl = this.personDetailsForm.get('id');
    idControl.enable();
    this.personService.updatePerson(this.personDetailsForm.value).pipe(take(1)).subscribe(savedPerson => {
      this.person = savedPerson;
      idControl.disable();
    });
  }

  deletePerson = (): void => {
    const idControl: AbstractControl = this.personDetailsForm.get('id');
    idControl.enable();
    console.log(this.personDetailsForm.value);
    this.personService.deletePerson(this.personDetailsForm.value).pipe(take(1)).subscribe(() => {
      this.navigateToAdminPanel();
      idControl.disable();
    });
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

}

