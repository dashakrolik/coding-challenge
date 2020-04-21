import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CandidateService } from '@service/candidate/candidate.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidates: Observable<ICandidate[]>;

  constructor(
    private candidateService: CandidateService
  ) {
  }

  ngOnInit() {
    this.candidates = this.candidateService.getCandidates();
  }
}
