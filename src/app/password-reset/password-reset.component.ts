import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );
  }

  ngOnInit(): void {
  }

  forgot() {
    let email = this.passwordForm.value.email;
    let that = this;
    this.authService.ForgotPassword(email)
      .then(() => {
        that._snackBar.open('Password reset email sent, check your inbox.', 'Close');
      })
      .catch((error) => {
        that._snackBar.open(error, 'Close');
      });
  }

}
