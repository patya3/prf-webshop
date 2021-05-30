import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'webshop';

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    /*
     * Check if user object exists in localStorage.
     * If exists, check if that user is authenticated on the server.
     */
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const isAuthenticated = await this.authService.checkAuthenticated();
      if (!isAuthenticated) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        this.router.navigateByUrl('/auth/login');
      } else {
        this.authService.user = user;
      }
    }
  }

  /* Logout current user. Destroy session on server. */
  logout(): void {
    this.authService.logout().subscribe(
      (res) => {
        if (res.status === 200 && res.body.successfull) {
          this.snackBar.open(res.body.msg, 'Cancel');
          localStorage.removeItem('user');
          localStorage.removeItem('cart');
          this.authService.user = null;
          this.router.navigateByUrl('/auth/login');
        }
      },
      (error) => {
        this.snackBar.open(error, 'Cancel', { duration: 3000 });
      }
    );
  }
}
