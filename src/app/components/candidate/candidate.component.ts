import { Component, OnInit } from '@angular/core';
import { CandidateService } from '@service/candidate/candidate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidates$: Observable<Candidate[]>;

  constructor(
    private candidateService: CandidateService
  ) {
  }

  ngOnInit() {
    this.candidates$ = this.candidateService.getCandidates();
  }
}
