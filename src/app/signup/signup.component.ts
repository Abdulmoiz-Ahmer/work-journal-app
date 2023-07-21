import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  accountForm: FormGroup;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.accountForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }
    );
  }

  ngOnInit(): void {
  }

  signup() {
    let email = this.accountForm.value.email;
    let password = this.accountForm.value.password;
    this.authService.SignUp(email, password).then(e => {

    });
  }

}
