import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { DialogService } from '@services/dialog/dialog.service';
import { PersonService } from '@services/person/person.service';
import { RoleService } from '@services/role/role.service';

/**
 * We need the interface IPersonFormValues to extend IPerson.
 * However, the IRole[] doesn't work with the mat-select,
 * so we need to overwrite the roles field for further typesafety #rulesaremadetobebroken
 */
// @ts-ignore
interface IPersonFormValues extends IPerson {
  roles: string[]; // override of IRole[]
}

interface IPersonFormGroup extends FormGroup {
  value: IPersonFormValues;
  controls: {
    id: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
    username: AbstractControl;
    roles: AbstractControl;
    password: AbstractControl;
  };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  person: IPerson;
  form: IPersonFormGroup;
  allRoles: IRole[];
  roles: IRole[];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialogService: DialogService,
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    this.createForm();

    const id = parseInt(this.route.snapshot.params.id);
    this.personService.getPersonById(id).pipe(take(1)).subscribe(person => {
      this.person = person;
      this.fillForm();
    });

    this.roleService.getRoles().pipe(take(1)).subscribe(allRoles => {
      this.allRoles = allRoles;
    });
  }

  createForm = (): void => {
    this.form = this.formBuilder.group({
      id: [{ value: 0, disabled: true }],
      firstName: [''],
      lastName: [''],
      username: [''],
      roles: [''],
      password: ['']
    }) as IPersonFormGroup; // make sure to double-check this list with the interface
  }

  fillForm = (): void => {
    const values: IPersonFormValues = {
      ...this.person,
      password: '', // reset this field

      // mat-select only allows a string-array to pre-select values. Ugly, but yeah ¯\_(ツ)_/¯
      roles: this.person.roles.map(role => role.name)
    };

    this.form.patchValue(values);
  }

  savePerson = () => {
    console.log(this.getPersonFromFormValue());
    const data = {
      title: 'Save personDetails',
      messages: ['Are you sure you want to save these changes?']
    };
    this.dialogService.openOkCancel(data)
      .then(this.savePersonToBackend).catch(() => { });
  }

  savePersonToBackend = (): void => {
    this.personService.updatePerson(this.getPersonFromFormValue()).pipe(take(1)).subscribe(savedPerson => {
      this.person = savedPerson;
    });
  }

  deletePerson = () => {
    const data = {
      title: 'Delete person',
      messages: ['Are you sure you want to delete this person?<br/>This also deletes all their submissions.']
    };
    this.dialogService.openOkCancel(data)
      .then(this.deletePersonOnBackend).catch(() => {
        // when the user cancels, do nothing
      });
  }

  deletePersonOnBackend = (): void => {
    const idControl = this.form.controls.id;
    idControl.enable();
    this.personService.deletePerson(this.getPersonFromFormValue()).pipe(
      take(1)
    ).subscribe(() => {
      this.navigateToAdminPanel();
      idControl.disable();
    });
  }

  /**
   * Get the person in the correct format from the form.
   * Overwrite just the roles because IPersonFormValues has { roles: string[] } instead of { roles: IRole[] }
   */
  getPersonFromFormValue = (): IPerson => {
    // Retrieve the right roles by checking the mat-select result
    const roles: IRole[] = this.allRoles.filter(role => {
      return this.form.value.roles.includes(role.name);
    });

    return {
      ...this.form.value,
      id: this.person.id, // we can't change the id
      roles // and overwrite the roles
    };
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

}
