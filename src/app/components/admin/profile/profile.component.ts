import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '@service/person/person.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MessageDialogComponent } from '@components/dialog/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogOpener } from '@components/dialog/DialogOpener';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  person: Person;
  personDetailsForm: FormGroup;
  // TODO: get roles from backend
  roles: string[] = ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private dialogOpener: DialogOpener,
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
    this.personDetailsForm.get('roles').setValue(this.getRoles());
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
    this.personService.deletePerson(this.personDetailsForm.value).pipe(take(1)).subscribe(() => {
      this.navigateToAdminPanel();
      idControl.disable();
    });
  }

  // TODO: write a setRoles function. Where the roles are converted to role objects.
  getRoles = (): string[] => {
    const arr = [];
    this.person.roles.forEach(element => {
      arr.push(element.name);
    });
    return arr;
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

  newFun = (): void => {
    console.log(this.person);
    console.log(this.personDetailsForm.value);
  }

  openDialog() {
    const data = {
      title: 'Alert!',
      message: 'Are you agreed?'
    };
    this.dialogOpener.openMessageDialog(data)
      .then((value) => {
        console.log(value);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(MessageDialogComponent, {
  //     width: '250px',
  //     data: {
  //       title: 'Alert!',
  //       message: 'Are you agreed?'
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('Dialogbox was closed');
  //     console.log('result: ' + result);
  //   });
  // }
}
