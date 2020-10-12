import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { LoginUserData } from '../../../Models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl(null, { validators: [Validators.required] }),
  });

  constructor(
    private _authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) {
      this.openSnackBar(
        'Please Enter Valid Data For Login!',
        'OK',
        'center',
        'top'
      );
      return;
    }

    const userData: LoginUserData = {
      email: this.getFormControl('email').value,
      password: this.getFormControl('password').value,
    };
    this._authService.login(userData);
  }

  getFormControl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  openSnackBar(
    message: string,
    action: string,
    horizontalPos: MatSnackBarHorizontalPosition,
    verticalPos: MatSnackBarVerticalPosition
  ) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: horizontalPos,
      verticalPosition: verticalPos,
    });
  }
}
