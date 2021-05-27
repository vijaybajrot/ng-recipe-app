import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/root.reducer';

import * as authActions from '../auth/store/auth.actions';

const KEY = 'AIzaSyCNXO1DBNHiIbzNgC6fpiFLhOf5NwmESwc';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  register(data: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`,
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((response: AuthResponse) => {
          return this.handleAuth(response);
        })
      );
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,
        {
          email: data.email,
          password: data.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response: AuthResponse) => {
          return this.handleAuth(response);
        })
      );
  }

  autoLogin() {
    const userSnapshot: any = JSON.parse(
      localStorage.getItem('user.snapshot') || '{}'
    );
    if (!userSnapshot) return;

    const user = new User(
      userSnapshot.email,
      userSnapshot.id,
      userSnapshot._token,
      new Date(userSnapshot._tokenExpDate)
    );

    if (user.token) {
      console.log('dispatching to store')
      // this.user.next(user);
      this.store.dispatch(
        new authActions.Login({
          id: userSnapshot.id,
          email: userSnapshot.email,
          token: userSnapshot._token,
          tokenExpireDate: new Date(userSnapshot._tokenExpDate),
        })
      );
    }
  }

  handleError(errorResponse: HttpErrorResponse) {
    let message = 'Unknown error';
    const { error } = errorResponse.error;
    if (!error || !error.message) {
      return throwError(new Error(message));
    }

    message = error.message;
    return throwError(new Error(message));
  }

  handleAuth(response: AuthResponse) {
    const expiredAt = new Date(
      new Date().getTime() + parseInt(response.expiresIn) * 1000
    );
    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expiredAt
    );
    // this.user.next(user);
    this.store.dispatch(
      new authActions.Login({
        id: response.localId,
        email: response.email,
        token: response.idToken,
        tokenExpireDate: expiredAt,
      })
    );
    localStorage.setItem('user.snapshot', JSON.stringify(user));
  }

  logout() {
    this.store.dispatch(new authActions.Logout())
    localStorage.removeItem('user.snapshot');
  }
}
