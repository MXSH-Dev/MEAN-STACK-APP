import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { NewUser } from '../../../Models/new-user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  isLoading: boolean = false;
  passwordMatch: boolean = false;
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required, Validators.email],
    }),
    username: new FormControl(null, { validators: [Validators.required] }),
    password: new FormControl(null, { validators: [Validators.required] }),
    passwordConfirm: new FormControl(null, {
      validators: [Validators.required],
    }),
  });

  constructor(
    private _authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getFormControl('passwordConfirm').valueChanges.subscribe((value) => {
      if (value === this.getFormControl('password').value) {
        this.passwordMatch = true;
      }
    });
  }

  registerNewUser() {
    if (this.registerForm.invalid || !this.passwordMatch) {
      this.openSnackBar(
        'Please Enter Valid Data For Registering!',
        'OK',
        'center',
        'top'
      );
      return;
    }
    const newUser: NewUser = {
      email: this.getFormControl('email').value,
      username: this.getFormControl('username').value,
      password: this.getFormControl('password').value,
    };

    this._authService.createNewUser(newUser);
  }

  getFormControl(controlName: string) {
    return this.registerForm.get(controlName);
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
