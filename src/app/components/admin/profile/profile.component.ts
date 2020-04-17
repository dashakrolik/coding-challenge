import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '@service/person/person.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MessageDialogComponent } from '@components/dialog/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '@service/dialog/dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  person: Person;
  personDetailsForm: FormGroup;
  // TODO: get roles from backend
  roles: Role[] = [
    { id: 1, name: 'ROLE_USER' },
    { id: 2, name: 'ROLE_MODERATOR' },
    { id: 3, name: 'ROLE_ADMIN' }
  ];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private dialogService: DialogService,
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
      username: [''],
      roles: [''],
      password: ['']
    });
  }

  fillForm = (): void => {
    this.personDetailsForm.patchValue({ ...this.person });
    this.personDetailsForm.get('password').setValue('');
    console.log(this.personDetailsForm.value);
  }

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
    this.personService.deletePerson(this.personDetailsForm.value).pipe(take(1)).subscribe(() => {
      this.navigateToAdminPanel();
      idControl.disable();
    });
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

  openDialog() {
    const data = {
      title: 'Alert!',
      message: 'Are you agreed?'
    };
    this.dialogService.openMessageDialog(data)
      .then((value) => {
        console.log(value);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
