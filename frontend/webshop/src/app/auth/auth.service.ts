import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any = null;

  constructor(private http: HttpClient) {}

  /* Register user with email and password. */
  register(email: string, password: string): Observable<any> {
    return this.http.post(
      environment.serverUrl + 'auth/register',
      { email, password },
      { withCredentials: true, responseType: 'json', observe: 'response' }
    );
  }

  /* Log in user with email and password. */
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      environment.serverUrl + 'auth/login',
      { email, password },
      { withCredentials: true, responseType: 'json', observe: 'response' }
    );
  }

  /* Logout user, destroy session on server side. */
  logout(): Observable<any> {
    return this.http.post(environment.serverUrl + 'auth/logout', null, {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
    });
  }

  /* Check if user is authenticad on the server side. */
  async checkAuthenticated(): Promise<boolean> {
    const isAuthenticated = await this.http
      .get<boolean>(environment.serverUrl + 'auth/is-authenticated', {
        withCredentials: true,
      })
      .pipe(
        take(1),
        map((loggedIn: boolean) => {
          return loggedIn;
        })
      )
      .toPromise();
    return isAuthenticated;
  }
}
