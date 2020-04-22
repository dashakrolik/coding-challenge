import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { take } from 'rxjs/operators';

import { PersonService } from '@services/person/person.service';
import { DialogService } from '@services/dialog/dialog.service';
import { RoleService } from '@services/role/role.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  person: IPerson;
  personDetailsForm: FormGroup;
  // TODO: get roles from backend
  roles: string[];
  allRoles: IRole[];

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
      this.roles = allRoles.map(role => role.name);
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
    this.personDetailsForm.get('roles').setValue(this.person.roles.map(role => role.name));
    this.personDetailsForm.get('password').setValue('');
  }

  /**
   * Returns array of strings
   */
  getRolesStrs = (person: IPerson): string[] => {
    return person.roles.map(role => role.name);
  }

  savePerson = () => {
    const data = {
      title: 'Save personDetails',
      message: 'Are you sure you want to save these changes?'
    };
    this.dialogService.openOkCancel(data)
      .then(() => {
        this.savePersonToBackend();
      }).catch(() => { });
  }

  savePersonToBackend = (): void => {
    const personId = this.person.id;
    this.person = this.personDetailsForm.value;
    this.person.id = personId;
    this.person.roles = this.allRoles.filter(role => {
      return this.person.roles.includes(role.name as string) as boolean;
    }
    );
    this.personService.updatePerson(this.person).pipe(take(1)).subscribe(savedPerson => {
      this.person = savedPerson;
    });
  }

  deletePerson = () => {
    const data = {
      title: 'Delete person',
      message: 'Are you sure you want to delete this person?<br/>This also deletes all their submissions.'
    };
    this.dialogService.openOkCancel(data)
      .then(() => {
        this.deletePersonOnBackend();
      }).catch(() => { });
  }

  deletePersonOnBackend = (): void => {
    const idControl: AbstractControl = this.personDetailsForm.get('id');
    idControl.enable();
    this.personService.deletePerson(this.personDetailsForm.value).pipe(take(1)).subscribe(() => {
      this.navigateToAdminPanel();
      idControl.disable();
    });
  }

  navigateToAdminPanel = () => this.router.navigate(['/admin']);

}
