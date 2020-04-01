import { Component, OnInit } from '@angular/core';
import { HttpClientService } from "../../service/http/http-client.service";

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {

  // Here the candidate names are stored to be used in the html
  candidates: Candidate[];
  errorMessage: String;

  constructor(
    private httpClientService: HttpClientService
  ) {
    this.errorMessage = "";
  }

  ngOnInit() {
    this.httpClientService.getCandidates().subscribe(
      response => this.handleSuccessfulResponse(response),
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
        this.errorMessage = err.error.message;
      }
    );
  }

  handleSuccessfulResponse(response) {
    // The response from the backend with the candidates from the database.
    this.candidates = response;
  }
}
