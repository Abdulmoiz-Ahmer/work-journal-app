import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    private _snackBar: MatSnackBar
  ) {
    this.accountForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern("^([0-9\\(\\)\\/\\+ \\-]*)$")]]
      }
    );
  }

  ngOnInit(): void {
  }

  signup() {
    let email = this.accountForm.value.email;
    let password = this.accountForm.value.password;
    let phone = this.accountForm.value.phone;
    if (this.accountForm.invalid) {
      return;
    }
    let that = this;
    this.authService.SignUp(email, password)
      .then(result => {
        this.authService.SetUserData(result.user, phone)
          .then(() => {
            that._snackBar.open('Your account is created successfully.', 'Close');
            that.authService.router.navigate(['/']);
          });
      })
      .catch((error) => {
        that._snackBar.open(error, 'Close');
      });
  }

}
