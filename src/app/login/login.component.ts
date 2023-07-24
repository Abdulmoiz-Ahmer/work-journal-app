import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router
  ) {

    if(this.authService.isLoggedIn){
      this.router.navigate(['/journals'])
    }
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }
    );
  }

  ngOnInit(): void {
  }

  login(){
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    this.authService.SignIn(email, password);
  }

}
