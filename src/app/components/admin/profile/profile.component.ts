import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/types/Person';
import { PersonService } from 'src/app/service/person/person.service';
import { SubmissionService } from 'src/app/service/submission/submission.service';
import { Submission } from '../../../types/Submission';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  person: Person;
  submissions: Submission[];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private submissionsService: SubmissionService
  ) { }

  ngOnInit(): void {
    let personId: number;
    this.route.params.subscribe(event => {
      personId = event.id;
    });
    if (history.state.person === undefined) {
      this.personService.getPersonById(personId).subscribe(person => {
        this.person = person;
      });
    } else {
      this.person = history.state.person;
    }
    this.submissionsService.getAllSubmissionsFromPerson(personId).subscribe(submissions => {
      this.submissions = submissions;
    });
    console.log(this.submissions);
  }
}
