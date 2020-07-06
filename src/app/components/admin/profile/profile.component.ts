import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { DialogService } from '@services/dialog/dialog.service';
import { PersonService } from '@services/person/person.service';
import { RoleService } from '@services/role/role.service';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class AdminProfileComponent implements OnInit {
  id = Number(this.route.snapshot.paramMap.get('personId'));
  // tslint:disable-next-line: variable-name
  private _person: IPerson;
  form: FormGroup;
  allRoles: IRole[];

  get person() {
    return this._person;
  }
  set person(person: IPerson) {
    person = this.fixPersonRoles(person);
    this._person = person;
  }

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private roleService: RoleService,
    adminService: AdminService,
  ) {
    adminService.activeComponent.next('users');
  }

  ngOnInit(): void {
    this.roleService.getRoles().pipe(take(1)).subscribe(allRoles => {
      this.allRoles = allRoles;
      this.personService.getPersonById(this.id).pipe(take(1)).subscribe(person => {
        person = this.fixPersonRoles(person);
        this.person = person;
        this.createForm();
        this.fillForm();
      });
    });
  }

  createForm = (): void => {
    this.form = new FormGroup({
      id: new FormControl({ value: this.person.id, disabled: true }),
      firstName: new FormControl(this.person.firstName),
      lastName: new FormControl(this.person.lastName),
      username: new FormControl(this.person.username),
      roles: new FormControl(this.person.roles),
      password: new FormControl(this.person.password)
    });
  }

  fillForm = (): void => {
    const values: IPerson = {
      ...this.person,
      password: '', // reset this field
    };

    this.form.patchValue(values);
  }

  savePerson = () => {
    const data = {
      title: 'Save personDetails',
      messages: ['Are you sure you want to save these changes?']
    };
    this.dialogService.openOkCancel(data)
      .then(this.savePersonToBackend).catch(() => {
        // when the user cancels, do nothing
      });
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
      this.router.navigate(['/admin']);
      idControl.disable();
    });
  }

  fixPersonRoles = (person: IPerson): IPerson => {
    // Deze filter is om ervoor te zorgen dat de person.roles en de rollen binnegehaald van de frontend dezelfde objecten zijn.
    // Zonder dit werkt het prefillen van de role dropdown niet.
    person.roles = this.allRoles.filter(role => {
      // Om een magische reden werkt het prefillen wel met een for loop, maar niet met een forEach loop
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < person.roles.length; i++) {
        const personRole = person.roles[i];
        if (personRole.id === role.id && personRole.name === role.name) { return true; }
      }
      return false;
    });
    return person;
  }

  /**
   * Get the person in the correct format from the form.
   * Overwrite just the roles because IPersonFormValues has { roles: string[] } instead of { roles: IRole[] }
   */
  getPersonFromFormValue = (): IPerson => {
    let password: string;
    if (this.form.get('password').value === '') {
      password = 'password has not changed!';
    } else {
      password = this.form.get('password').value;
    }
    return {
      ...this.person,
      ...this.form.value,
      id: this.person.id, // we can't change the id
      password,
    };
  }

}
