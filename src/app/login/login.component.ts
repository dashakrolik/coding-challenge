import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = 'sander.kools@ordina.nl';
  password = '';
  invalidLogin = false;

  constructor(private router: Router,
              private loginservice: AuthenticationService) { }

  ngOnInit() {
  };

  checkLogin() {
    console.log("check login");
    // if (this.loginservice.authenticate(this.email, this.password)
    // ) {
    //   this.router.navigate(['']);
    //   this.invalidLogin = false;
    // } else
    //   this.invalidLogin = true;
  }

}
