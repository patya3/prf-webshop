import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../auth.validators';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
    passwordConfirm: new FormControl('', {
      validators: [Validators.required, confirmPasswordValidator],
    }),
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  /* Register and save user to the database. */
  register(): void {
    const { email, password } = this.registerForm.value;
    if (email && password) {
      this.authService.register(email, password).subscribe(
        (res) => {
          if (res.status == 200 && res.body.successfull) {
            this.snackBar.open(res.body.msg, 'Cancel');
            this.router.navigateByUrl('/auth/login');
          } else {
            this.snackBar.open(res.body.error, 'Cancel');
          }
        },
        (error) => {
          this.snackBar.open(error.error.error, 'Cancel');
        }
      );
    }
  }
}
