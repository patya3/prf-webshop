import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  /* Log in user and save user id and email in localStorage. */
  login(): void {
    const { email, password } = this.loginForm.value;
    if (email && password) {
      this.authService.login(email, password).subscribe(
        (res) => {
          if (res.status == 200 && res.body.successfull) {
            const user = res.body.user;
            localStorage.setItem(
              'user',
              JSON.stringify({ id: user._id, email: user.email })
            );
            this.authService.user = user;
            this.snackBar.open(res.body.msg, 'Cancel', { duration: 3000 });
            this.router.navigateByUrl('/products/list');
          }
        },
        (error) => {
          this.snackBar.open(error.error.error, 'Cancel', { duration: 3000 });
        }
      );
    }
  }
}
