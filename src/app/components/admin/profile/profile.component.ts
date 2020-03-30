import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/types/Person';
import { PersonService } from 'src/app/service/person/person.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  personId: number;
  person: Person;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.personId = event.id;
      this.personService.getPersonById(event.id).subscribe(person => {
        this.person = person;
      })
    });

  }

}
